-- MySQL Database Setup Script for ZENIX Loan Recovery CRM
-- Run this script to create the database and initial tables

-- Create database
CREATE DATABASE IF NOT EXISTS LoanRecoveryCRM 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE LoanRecoveryCRM;

-- Create CustomColumns table
CREATE TABLE IF NOT EXISTS CustomColumns (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CompanyId INT NOT NULL,
    ColumnName VARCHAR(100) NOT NULL,
    DisplayName VARCHAR(100) NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    IsCustom BOOLEAN NOT NULL DEFAULT FALSE,
    SortOrder INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY UK_CustomColumns_CompanyId_ColumnName (CompanyId, ColumnName)
);

-- Create Customers table
CREATE TABLE IF NOT EXISTS Customers (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CustomerName VARCHAR(100) NOT NULL,
    LoanId VARCHAR(50) NOT NULL,
    LoanAmount DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    MobileNo VARCHAR(15) NOT NULL,
    DPD INT NOT NULL DEFAULT 0,
    Outstanding DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    POSAmount DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    EMIAmount DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    PendingDues DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    PaymentLink TEXT NULL,
    BranchName VARCHAR(100) NULL,
    LoanType VARCHAR(50) NULL,
    Remarks TEXT NULL,
    CompanyId INT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default custom columns
INSERT INTO CustomColumns (Id, CompanyId, ColumnName, DisplayName, IsActive, IsCustom, SortOrder) VALUES
(1, 1, 'CustomerName', 'Customer Name', TRUE, FALSE, 1),
(2, 1, 'LoanId', 'Loan ID', TRUE, FALSE, 2),
(3, 1, 'LoanAmount', 'Loan Amount', TRUE, FALSE, 3),
(4, 1, 'MobileNo', 'Mobile No', TRUE, FALSE, 4),
(5, 1, 'DPD', 'DPD', TRUE, FALSE, 5),
(6, 1, 'Outstanding', 'Outstanding', TRUE, FALSE, 6),
(7, 1, 'POSAmount', 'POS Amount', TRUE, FALSE, 7),
(8, 1, 'EMIAmount', 'EMI Amount', TRUE, FALSE, 8),
(9, 1, 'PendingDues', 'Pending Dues', TRUE, FALSE, 9),
(10, 1, 'PaymentLink', 'Payment Link', TRUE, FALSE, 10),
(11, 1, 'Actions', 'Actions', TRUE, FALSE, 11)
ON DUPLICATE KEY UPDATE DisplayName = VALUES(DisplayName);

-- Insert sample customer data
INSERT INTO Customers (CustomerName, LoanId, LoanAmount, MobileNo, DPD, Outstanding, POSAmount, EMIAmount, PendingDues, BranchName, LoanType, CompanyId) VALUES
('Rajesh Kumar', 'LN001', 500000.00, '9876543210', 15, 250000.00, 200000.00, 15000.00, 45000.00, 'Mumbai Central', 'Personal Loan', 1),
('Priya Sharma', 'LN002', 750000.00, '9876543211', 30, 400000.00, 350000.00, 22000.00, 66000.00, 'Delhi North', 'Home Loan', 1),
('Amit Patel', 'LN003', 300000.00, '9876543212', 7, 150000.00, 120000.00, 8500.00, 17000.00, 'Ahmedabad', 'Business Loan', 1),
('Sunita Singh', 'LN004', 200000.00, '9876543213', 45, 180000.00, 160000.00, 6000.00, 18000.00, 'Pune', 'Personal Loan', 1),
('Vikram Gupta', 'LN005', 1000000.00, '9876543214', 60, 800000.00, 750000.00, 35000.00, 105000.00, 'Bangalore', 'Home Loan', 1),
('Meera Joshi', 'LN006', 150000.00, '9876543215', 10, 75000.00, 60000.00, 4500.00, 13500.00, 'Chennai', 'Personal Loan', 1),
('Ravi Verma', 'LN007', 600000.00, '9876543216', 25, 350000.00, 300000.00, 18000.00, 54000.00, 'Hyderabad', 'Business Loan', 1),
('Kavita Reddy', 'LN008', 450000.00, '9876543217', 5, 200000.00, 180000.00, 12000.00, 24000.00, 'Kolkata', 'Personal Loan', 1),
('Suresh Nair', 'LN009', 800000.00, '9876543218', 20, 500000.00, 450000.00, 25000.00, 75000.00, 'Kochi', 'Home Loan', 1),
('Anita Das', 'LN010', 250000.00, '9876543219', 35, 180000.00, 150000.00, 7500.00, 22500.00, 'Bhubaneswar', 'Personal Loan', 1)
ON DUPLICATE KEY UPDATE CustomerName = VALUES(CustomerName);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_company_id ON Customers(CompanyId);
CREATE INDEX IF NOT EXISTS idx_customers_loan_id ON Customers(LoanId);
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON Customers(MobileNo);
CREATE INDEX IF NOT EXISTS idx_customers_dpd ON Customers(DPD);
CREATE INDEX IF NOT EXISTS idx_customcolumns_company_active ON CustomColumns(CompanyId, IsActive);

-- Show tables and sample data
SHOW TABLES;
SELECT COUNT(*) as TotalCustomers FROM Customers;
SELECT COUNT(*) as TotalColumns FROM CustomColumns;

-- Display sample customer data
SELECT CustomerName, LoanId, LoanAmount, MobileNo, DPD, Outstanding 
FROM Customers 
LIMIT 5;

COMMIT;