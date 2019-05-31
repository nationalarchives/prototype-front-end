# Transfer Digital Records Front End

## Purpose

To allow users to upload files to an S3 bucket and to generate associated metadata.

This is an overview of the project as a whole. The other components are

[Containers project](https://github.com/nationalarchives/tdr-containers)
[GraphQL Server project](https://github.com/nationalarchives/tdr-graphql)
[Other scripts](https://github.com/nationalarchives/tdr-aws)

## Architecture

![TDR Architecture Diagram](https://s3.eu-west-2.amazonaws.com/tdr-front-end/TDR.png)

## Main flow

1. The user logs in using AWS cognito and creates a collection using a form. This is defined in the [CreateComponent.tsx](https://github.com/nationalarchives/tdr-front-end/blob/master/src/components/pages/CreateCollection.tsx) file
2. This sends a mutation to the GraphQL server running as a lambda function which creates an entry in a table on the RDS database.
3. The user then chooses which files to upload ([Upload.tsx](https://github.com/nationalarchives/tdr-front-end/blob/master/src/components/pages/Upload.tsx))
4. This runs another mutation to store the files and some metadata in the RDS database. A temporary token is retrieved from the cognito user and used to upload the files to the S3 bucket.
5. There is an event notification on the S3 bucket which will trigger a lambda when there is a put event. This [lambda](https://github.com/nationalarchives/tdr-aws/blob/master/tdr-run-tasks.py) does two things.

   - Sends the put event to an SQS queue
   - Starts a task defined in ECS

6. This task runs three containers. One is a virus checking service, one is a file type checking service and the last is the code which runs the checks. This code picks up the message from the SQS queue, downloads the file using the client credentials flow through cognito and runs the checks against it. Once the checks are done, it updates the database, via the GraphQL lambda.
7. The front end can then poll the rds datbase via the GraphQL lambda to display the results of the checks carried out by the ECS containers.
