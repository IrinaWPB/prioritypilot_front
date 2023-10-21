import {Button, Card, Icon} from 'semantic-ui-react'
import { useState } from 'react'
import EditTaskForm from './EditTaskForm'
import UserApi from '../api'

function TaskCard({ task, setTasks, tasks, deleteTask }) {
  const [ showEditTask, setShowEditTask ] = useState(false)
  const [ currentStatus, setCurrentStatus ] = useState(task.status)
  //function updates status with db and locally
  const updateStatus = async (status) => {
    let taskWithNewStatus = {...task, status: status}
    await UserApi.editTask(taskWithNewStatus, task.project_id, task.id)
    let list = tasks.map(item => { if(item.id === task.id){item.status=status}return item})
    setTasks(list)
  }
  //saves updates for tasks
  const addUpdates = async (data) => {
    await UserApi.editTask(data, task.project_id, task.id)
    let list = tasks.map(item => { if(item.id === task.id){item = data}return item})
    setTasks(list)
  }
  //handles delete button click
  const handleDelete = async () => {
    await deleteTask(task.id)
  }

  return (
    <>{showEditTask && <EditTaskForm task={task} addUpdates={addUpdates} setShowForm={setShowEditTask} tasks={tasks}/>}
      <Card raised className='task-card'>
        <Card.Content>
          <div className='card-icons'>
            {currentStatus === "Not Started" && <Button size="tiny" onClick={()=>updateStatus('In Progress')}>Start Task</Button>}
            {(currentStatus === "Not Started" || currentStatus === "In Progress") && <Button size="tiny" onClick={()=>updateStatus('Complete')}>Complete Task</Button>}
            {currentStatus !== "Complete" &&
            <Button size="tiny" icon onClick={()=>setShowEditTask(true)}><Icon name="edit"/></Button>}
            <Button size="tiny" icon onClick={handleDelete}><Icon name="delete"/></Button>
          </div>
          <Card.Header className='task-name'>{task.task_name}</Card.Header>
          <Card.Meta>Priority: {task.priority.toUpperCase()}</Card.Meta>
          <Card.Meta>Deadline: {task.end_date.toString()}</Card.Meta>
          <div className='card-icons'>
            {currentStatus === "In Progress" && <> <Icon name="clock" color='green' className="in-progress-icon"/>In Progress </>}
            {currentStatus === "Complete" && <> <Icon name="check circle" color='green' className='completed'/>Completed </>}
          </div>
          <Card.Description>{task.description}</Card.Description>
          <Card.Meta></Card.Meta>
        </Card.Content>
        <Card.Content extra>
        <Button size="tiny">AI Recommendations</Button> <span className='created-at'>Date created: {task.created_at}</span>
        </Card.Content>
      </Card>
    </>  
  )   
}  
export default TaskCard