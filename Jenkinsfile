pipeline{
    agent any
    stages{
        stage("Run containers"){
            steps{
                sh "docker-compose up -d mysql"
                sh "docker-compose up graphql"
            }            
        }
    }
    
}