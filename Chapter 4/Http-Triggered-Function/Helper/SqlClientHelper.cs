
using System;
using System.Data;
using System.Data.SqlClient;
using Company.Function.Models;

namespace Company.Function.Helper
{
    public static class SqlClientHelper
    {
        public static CustomerModel GetData(int customerId)
        {
            var connection = Environment.GetEnvironmentVariable("coonectionString");
            CustomerModel customer = new CustomerModel();
            using (SqlConnection conn = new SqlConnection(connection))
            {
                var text = "SELECT CustomerID, NameStyle, FirstName, MiddleName, LastName, CompanyName FROM SalesLT.Customer where CustomerID=" + customerId;
                SqlCommand cmd = new SqlCommand(text, conn);
                // cmd.Parameters.AddWithValue("@CustomerId", customerId);

                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader(CommandBehavior.SingleRow))
                {
                    while (reader.Read() && reader.HasRows)
                    {
                        customer.CustomerID = Convert.ToInt32(reader["CustomerID"].ToString());
                        customer.FirstName = reader["FirstName"].ToString();
                        customer.MiddleName = reader["MiddleName"].ToString();
                        customer.LastName = reader["LastName"].ToString();
                        customer.CompanyName = reader["CompanyName"].ToString();
                    }

                    conn.Close();
                }
            }

            return customer;
        }
    }

}