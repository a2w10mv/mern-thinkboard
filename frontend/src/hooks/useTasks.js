import { useState, useCallback } from 'react';

const useTasks = (initialTasks = [{ text: "", completed: false }]) => {
  const [tasks, setTasks] = useState(initialTasks);

  const handleTaskTextChange = useCallback((index, newText) => {
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      newTasks[index].text = newText;
      return newTasks;
    });
  }, []);

  const handleAddTask = useCallback(() => {
    setTasks(prevTasks => [...prevTasks, { text: "", completed: false }]);
  }, []);

  const handleRemoveTask = useCallback((index) => {
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      newTasks.splice(index, 1);
      return newTasks;
    });
  }, []);

  return {
    tasks,
    setTasks,
    handleTaskTextChange,
    handleAddTask,
    handleRemoveTask
  };
};

export default useTasks;
