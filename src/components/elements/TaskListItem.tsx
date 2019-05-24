import * as React from "react";

interface ITaskListItemProps {
  title: string;
  completed: boolean;
}

const TaskListItem: React.FunctionComponent<ITaskListItemProps> = props => {
  return (
    <ul className="app-task-list__items">
      <li className="app-task-list__item">
        <span className="app-task-list__task-name">{props.title}</span>
        <strong
          className={`govuk-tag${
            props.completed ? "" : "--inactive"
          } app-task-list__task-completed`}
        >
          {props.completed ? "Completed" : "Pending"}
        </strong>
      </li>
    </ul>
  );
};

export { TaskListItem };
