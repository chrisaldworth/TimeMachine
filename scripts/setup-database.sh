#!/bin/bash

# Database Setup Script for Rewind the Map
# This script sets up PostgreSQL with PostGIS for development

set -e

echo "🚀 Setting up database for Rewind the Map..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    print_success "Docker Compose is available"
}

# Start database services
start_database() {
    print_status "Starting database services..."
    
    # Start PostgreSQL and Redis
    docker-compose up -d postgres redis
    
    # Wait for services to be healthy
    print_status "Waiting for database to be ready..."
    
    # Wait for PostgreSQL
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose exec postgres pg_isready -U postgres -d rewind_the_map > /dev/null 2>&1; then
            print_success "PostgreSQL is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "PostgreSQL failed to start within 60 seconds"
        exit 1
    fi
    
    # Wait for Redis
    timeout=30
    while [ $timeout -gt 0 ]; do
        if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
            print_success "Redis is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Redis failed to start within 30 seconds"
        exit 1
    fi
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Run migrations
    cd src/backend
    npm run migrate
    cd ../..
    
    print_success "Database migrations completed"
}

# Test database connection
test_connection() {
    print_status "Testing database connection..."
    
    # Test PostgreSQL connection
    if docker-compose exec postgres psql -U postgres -d rewind_the_map -c "SELECT 1;" > /dev/null 2>&1; then
        print_success "PostgreSQL connection test passed"
    else
        print_error "PostgreSQL connection test failed"
        exit 1
    fi
    
    # Test PostGIS extension
    if docker-compose exec postgres psql -U postgres -d rewind_the_map -c "SELECT PostGIS_Version();" > /dev/null 2>&1; then
        print_success "PostGIS extension test passed"
    else
        print_error "PostGIS extension test failed"
        exit 1
    fi
    
    # Test Redis connection
    if docker-compose exec redis redis-cli ping | grep -q "PONG"; then
        print_success "Redis connection test passed"
    else
        print_error "Redis connection test failed"
        exit 1
    fi
}

# Show database information
show_info() {
    print_status "Database setup complete!"
    echo ""
    echo "📊 Database Information:"
    echo "  PostgreSQL: localhost:5432"
    echo "  Database: rewind_the_map"
    echo "  Username: postgres"
    echo "  Password: password"
    echo ""
    echo "🔴 Redis Information:"
    echo "  Host: localhost:6379"
    echo ""
    echo "🔧 Useful Commands:"
    echo "  View logs: docker-compose logs -f postgres"
    echo "  Connect to DB: docker-compose exec postgres psql -U postgres -d rewind_the_map"
    echo "  Stop services: docker-compose down"
    echo "  Restart services: docker-compose restart postgres redis"
    echo ""
    echo "✅ Database is ready for development!"
}

# Main execution
main() {
    echo "🎯 Rewind the Map - Database Setup"
    echo "=================================="
    echo ""
    
    check_docker
    check_docker_compose
    start_database
    run_migrations
    test_connection
    show_info
}

# Handle script arguments
case "${1:-}" in
    "start")
        check_docker
        check_docker_compose
        start_database
        ;;
    "stop")
        print_status "Stopping database services..."
        docker-compose down
        print_success "Database services stopped"
        ;;
    "restart")
        print_status "Restarting database services..."
        docker-compose restart postgres redis
        print_success "Database services restarted"
        ;;
    "migrate")
        run_migrations
        ;;
    "test")
        test_connection
        ;;
    "logs")
        docker-compose logs -f postgres
        ;;
    "connect")
        docker-compose exec postgres psql -U postgres -d rewind_the_map
        ;;
    *)
        main
        ;;
esac
