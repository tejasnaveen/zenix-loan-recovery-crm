# MySQL Connection Guide for ZENIX Loan Recovery CRM

## 🗄️ MySQL Database Setup

### Prerequisites
1. **MySQL Server 8.0+** installed and running
2. **MySQL Workbench** or command line access
3. **Root access** or database admin privileges

### Step 1: Install MySQL Server

#### Windows:
```bash
# Download MySQL Installer from https://dev.mysql.com/downloads/installer/
# Run the installer and select "MySQL Server" and "MySQL Workbench"
```

#### macOS:
```bash
# Using Homebrew
brew install mysql
brew services start mysql
```

#### Ubuntu/Linux:
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Step 2: Secure MySQL Installation
```bash
sudo mysql_secure_installation
```

### Step 3: Create Database and User
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE LoanRecoveryCRM CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user (recommended for production)
CREATE USER 'zenix_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON LoanRecoveryCRM.* TO 'zenix_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### Step 4: Run Database Setup Script
```bash
# Run the setup script
mysql -u zenix_user -p LoanRecoveryCRM < mysql-setup.sql
```

### Step 5: Update Connection String
Update your `appsettings.json` with your MySQL credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LoanRecoveryCRM;User=zenix_user;Password=your_secure_password;Port=3306;"
  }
}
```

## 🔧 Configuration Options

### Connection String Parameters
- **Server**: MySQL server hostname (localhost for local development)
- **Database**: Database name (LoanRecoveryCRM)
- **User**: MySQL username
- **Password**: MySQL password
- **Port**: MySQL port (default: 3306)
- **SslMode**: SSL connection mode (None, Preferred, Required)
- **CharSet**: Character set (utf8mb4 recommended)

### Example Connection Strings

#### Local Development:
```
Server=localhost;Database=LoanRecoveryCRM;User=root;Password=your_password;Port=3306;
```

#### Production with SSL:
```
Server=your-mysql-server.com;Database=LoanRecoveryCRM;User=zenix_user;Password=secure_password;Port=3306;SslMode=Required;
```

#### Cloud MySQL (AWS RDS):
```
Server=your-rds-endpoint.amazonaws.com;Database=LoanRecoveryCRM;User=admin;Password=your_password;Port=3306;SslMode=Required;
```

## 🚀 Running the Application

### 1. Install Dependencies
```bash
dotnet restore
```

### 2. Apply Database Migrations
```bash
# Create initial migration (if needed)
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

### 3. Run the Application
```bash
dotnet run
```

## 🔍 Troubleshooting

### Common Issues:

#### 1. Connection Refused
```
Error: Unable to connect to any of the specified MySQL hosts
```
**Solution**: 
- Check if MySQL service is running
- Verify server hostname and port
- Check firewall settings

#### 2. Authentication Failed
```
Error: Access denied for user 'username'@'localhost'
```
**Solution**:
- Verify username and password
- Check user privileges
- Ensure user can connect from the specified host

#### 3. Database Not Found
```
Error: Unknown database 'LoanRecoveryCRM'
```
**Solution**:
- Create the database using the setup script
- Verify database name in connection string

#### 4. SSL Connection Issues
```
Error: SSL connection error
```
**Solution**:
- Add `SslMode=None` for local development
- Configure SSL certificates for production

### Verification Commands:
```bash
# Test MySQL connection
mysql -u zenix_user -p -h localhost -P 3306 LoanRecoveryCRM

# Check database tables
SHOW TABLES;

# Verify sample data
SELECT COUNT(*) FROM Customers;
SELECT COUNT(*) FROM CustomColumns;
```

## 📊 Performance Optimization

### Recommended MySQL Configuration:
```ini
# /etc/mysql/mysql.conf.d/mysqld.cnf

[mysqld]
# InnoDB settings
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2

# Query cache
query_cache_type = 1
query_cache_size = 64M

# Connection settings
max_connections = 200
wait_timeout = 600

# Character set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

### Database Indexes:
The setup script includes optimized indexes for:
- Customer lookups by Company ID
- Loan ID searches
- Mobile number searches
- DPD (Days Past Due) filtering
- Custom column management

## 🔒 Security Best Practices

1. **Use dedicated database user** (not root)
2. **Strong passwords** with special characters
3. **Enable SSL** for production environments
4. **Regular backups** using mysqldump
5. **Firewall rules** to restrict database access
6. **Regular security updates** for MySQL server

## 📈 Monitoring and Maintenance

### Backup Script:
```bash
#!/bin/bash
# backup-mysql.sh
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u zenix_user -p LoanRecoveryCRM > backup_${DATE}.sql
```

### Performance Monitoring:
```sql
-- Check slow queries
SHOW PROCESSLIST;

-- Monitor table sizes
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE table_schema = 'LoanRecoveryCRM'
ORDER BY (data_length + index_length) DESC;
```

## 🌐 Cloud Deployment Options

### AWS RDS MySQL:
- Managed MySQL service
- Automatic backups and updates
- High availability options
- Performance monitoring

### Google Cloud SQL:
- Fully managed MySQL
- Automatic scaling
- Built-in security features
- Integration with other Google services

### Azure Database for MySQL:
- Managed MySQL service
- Built-in high availability
- Advanced security features
- Integration with Azure services

---

**🎯 Ready to connect? Follow the steps above and your ZENIX CRM will be running on MySQL!**