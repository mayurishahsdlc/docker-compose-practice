pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out staging source code...'
                checkout scm
            }
        }

        stage('Docker Check') {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Build') {
            steps {
                echo 'Building staging Docker images...'
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Starting staging Docker containers...'
                sh 'docker compose up -d'
            }
        }

        stage('Container Status') {
            steps {
                echo 'Checking staging container status...'
                sh 'docker compose ps'
                sh 'docker ps'
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Waiting for staging backend health check..."

                    for i in $(seq 1 12)
                    do
                        if curl -f http://127.0.0.1:4001/health
                        then
                            echo "Staging backend is healthy!"
                            exit 0
                        fi

                        echo "Staging backend not ready. Waiting 5 seconds..."
                        sleep 5
                    done

                    echo "Staging backend health check failed."

                    docker compose ps

                    docker compose logs --tail=100 backend

                    exit 1
                '''
            }
        }
    }

    post {
        always {
            echo 'Staging pipeline finished.'
            sh 'docker compose ps || true'
        }

        failure {
            echo 'Staging deployment failed. Check the console output.'
        }

        success {
            echo 'Staging deployment completed successfully!'
        }
    }
}
