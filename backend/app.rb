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

  # Created two custom attributes to allow for showing on the frontend, and
  # doing a bit of extra filtering
  # :name is for filtering, :department_name is to display
  attribute :department_name, :string
  attribute :name, :string, readable: false

  # Filter that does look up on First and Last name to see if entered value exists
  # Couldn't find a solution to do this on the full name, would be good to chat about
  filter :name, single: true do
    fuzzy_match do |scope, value|
      # TODO: do search on whole name, rather than piece of a name
      scope.where('first_name LIKE ? OR last_name LIKE ?', "%#{value}%", "%#{value}%")
    end
  end

  # Bonus 1 filter on departments
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
  # to fuzzy filter - &filter[name][fuzzy_match]=zack
  # to sort - &sort=first_name (ASC) || &sort=-first_name (DESC)
  # total count - &stats[total]=count
  # Relevant Endpoint for Employees, allows FE to do Sorting, Pagination
  # Fuzzy filtering, and retrieve total counts
  get '/api/v1/employees' do
    employees = EmployeeResource.all(params)
    employees.to_jsonapi
  end

  # Relevant Endpoint for Departments, this returns just the name of the department
  get '/api/v1/departments' do
    departments = DepartmentResource.all(params)
    departments.to_jsonapi
  end

  get '/api/v1/departments/:id' do
    departments = DepartmentResource.find(params)
    departments.to_jsonapi
  end
end
