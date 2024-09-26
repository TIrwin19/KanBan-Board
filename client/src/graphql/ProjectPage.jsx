import React from 'react';
import { useQuery, gql } from '@apollo/client';

// Define the GraphQL query to fetch project details
const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    getProject(id: $id) {
      id
      title
      columns {
        id
        title
        tasks {
          id
          title
          description
        }
      }
    }
  }
`;

const ProjectPage = ({ projectId }) => {
  // Use Apollo's useQuery hook to fetch the data
  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const project = data.getProject;

  return (
    <div>
      <h2>{project.title}</h2>
      {project.columns.map((column) => (
        <div key={column.id}>
          <h3>{column.title}</h3>
          <ul>
            {column.tasks.map((task) => (
              <li key={task.id}>
                {task.title}: {task.description}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProjectPage;
