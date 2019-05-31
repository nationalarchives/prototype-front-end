pipeline {
    agent {
        docker {
            image 'node:12-alpine'
        }
    }
    stages {
        stage('Checkout') {
            steps {
                checkout(scm)
            }
        }

        stage('Run checks') {
            steps {
                sh('yarn audit')
                sh('yarn test')
            }
        }
    }
}