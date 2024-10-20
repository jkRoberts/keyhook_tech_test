require 'faker'
require 'active_record'
require './seeds'
require 'kaminari'
require 'sinatra/base'
require 'graphiti'
require 'graphiti/adapters/active_record'
require 'pry'

class ApplicationResource < Graphiti::Resource
  self.abstract_class = true
  self.adapter = Graphiti::Adapters::ActiveRecord
  self.base_url = 'http://localhost:4567'
  self.endpoint_namespace = '/api/v1'
  # implement Graphiti.config.context_for_endpoint for validation
  self.validate_endpoints = false
end

class DepartmentResource < ApplicationResource
  self.model = Department
  self.type = :departments

  attribute :name, :string

  has_many :employees
end

class EmployeeResource < ApplicationResource
  self.model = Employee
  self.type = :employees

  attribute :first_name, :string
  attribute :last_name, :string
  attribute :age, :integer
  attribute :position, :string
  attribute :department_name, :string do
    @object.department.name
  end
  attribute :name, :string, readable: false do
    "#{@object.first_name} #{@object.last_name}"
  end

  filter :name, single: true do
    fuzzy_match do |scope, value|
      scope.where('first_name LIKE ? OR last_name LIKE ?', "%#{value}%", "%#{value}%")
    end
  end

  filter :department_name, single: true do
    eq do |scope, value|
      scope.joins(:department).where(department: {name: value})
    end
  end
end

Graphiti.setup!

class EmployeeDirectoryApp < Sinatra::Application
  configure do
    mime_type :jsonapi, 'application/vnd.api+json'
  end

  before do
    content_type :jsonapi
  end

  after do
    ActiveRecord::Base.connection_handler.clear_active_connections!
  end


  # to paginate - &page[size]=20&page[number]=2
  # to filter - &filter[department_name][eq]=IT
  # to fuzzy filter - &filter[name][fuzzy_match]=IT
  # to sort - &sort=first_name (ASC) || &sort=-first_name (DESC)
  # total count - &stats[total]=count

  get '/api/v1/employees' do
    employees = EmployeeResource.all(params)
    employees.to_jsonapi
  end

  get '/api/v1/departments' do
    departments = DepartmentResource.all(params)
    departments.to_jsonapi
  end

  get '/api/v1/departments/:id' do
    departments = DepartmentResource.find(params)
    departments.to_jsonapi
  end
end
