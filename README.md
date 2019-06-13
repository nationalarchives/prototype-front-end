# Transfer Digital Records Front End

## Purpose

To allow users to upload files to an S3 bucket and to generate associated metadata.

This is an overview of the project as a whole. The other components are

[Containers project](https://github.com/nationalarchives/tdr-containers)
[GraphQL Server project](https://github.com/nationalarchives/tdr-graphql)
[Other scripts](https://github.com/nationalarchives/tdr-aws)

## Architecture

![TDR Architecture Diagram](https://github.com/nationalarchives/tdr-front-end/blob/master/public/tdr.png)

## Main flow

1. The user logs in using AWS cognito and creates a collection using a form. This is defined in the [CreateComponent.tsx](https://github.com/nationalarchives/tdr-front-end/blob/master/src/components/pages/CreateCollection.tsx) file
2. This sends a mutation to the GraphQL server running as a lambda function which creates an entry in a table on the RDS database.
3. The user then chooses which files to upload ([Upload.tsx](https://github.com/nationalarchives/tdr-front-end/blob/master/src/components/pages/Upload.tsx))
4. This runs another mutation to store the files and some metadata in the RDS database. A temporary token is retrieved from the cognito user and used to upload the files to the S3 bucket.
5. There is an event notification on the S3 bucket which will trigger a step function.
6. This step function runs three ECS tasks in parallel, one for the virus checker, one for the file format check and one for the checksum check. The containers are defined in this [repository](https://github.com/nationalarchives/prototype-state-machine)
7. Once the tasks are run, the outputs are sent to separate SNS topics
8. There is a lambda which subscribes to these topics, picks up the output and sends the results to the graphql server, which updates the database. The lambda is defined [here](https://github.com/nationalarchives/prototype-topic-listeners)
9. The front end can then poll the rds datbase via the GraphQL lambda to display the results of the checks carried out by the ECS containers.
