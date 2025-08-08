using System;
using System.Data;
using Microsoft.Data.SqlClient;

namespace SkillsInternationalSchool.Classes
{
    /// <summary>
    /// Database helper class for managing SQL Server connections and operations.
    /// </summary>
    public class DatabaseHelper
    {
        private readonly string connectionString;

        /// <summary>
        /// Initializes a new instance of the DatabaseHelper class.
        /// </summary>
        public DatabaseHelper()
        {
            connectionString = "Server=.;Database=Student;Integrated Security=true;";
        }

        /// <summary>
        /// Gets a new SQL connection.
        /// </summary>
        /// <returns>A new SqlConnection object.</returns>
        public SqlConnection GetConnection()
        {
            return new SqlConnection(connectionString);
        }

        /// <summary>
        /// Tests the database connection.
        /// </summary>
        /// <returns>True if connection is successful, false otherwise.</returns>
        public bool TestConnection()
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    return true;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>
        /// Executes a non-query SQL command (INSERT, UPDATE, DELETE).
        /// </summary>
        /// <param name="query">The SQL query to execute.</param>
        /// <param name="parameters">The parameters for the query.</param>
        /// <returns>The number of rows affected.</returns>
        public int ExecuteNonQuery(string query, SqlParameter[] parameters = null)
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    using (var command = new SqlCommand(query, connection))
                    {
                        if (parameters != null)
                        {
                            command.Parameters.AddRange(parameters);
                        }
                        return command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Database error: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Executes a SQL query and returns a DataTable.
        /// </summary>
        /// <param name="query">The SQL query to execute.</param>
        /// <param name="parameters">The parameters for the query.</param>
        /// <returns>A DataTable containing the query results.</returns>
        public DataTable ExecuteQuery(string query, SqlParameter[] parameters = null)
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    using (var command = new SqlCommand(query, connection))
                    {
                        if (parameters != null)
                        {
                            command.Parameters.AddRange(parameters);
                        }
                        
                        using (var adapter = new SqlDataAdapter(command))
                        {
                            var dataTable = new DataTable();
                            adapter.Fill(dataTable);
                            return dataTable;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Database query error: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Executes a SQL query and returns a single scalar value.
        /// </summary>
        /// <param name="query">The SQL query to execute.</param>
        /// <param name="parameters">The parameters for the query.</param>
        /// <returns>The scalar result.</returns>
        public object ExecuteScalar(string query, SqlParameter[] parameters = null)
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    using (var command = new SqlCommand(query, connection))
                    {
                        if (parameters != null)
                        {
                            command.Parameters.AddRange(parameters);
                        }
                        return command.ExecuteScalar();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Database scalar query error: {ex.Message}", ex);
            }
        }
    }
}