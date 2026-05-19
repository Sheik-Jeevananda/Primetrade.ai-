import {type Response } from "express";

import Task from "../models/Task.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";


export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({
      title,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};



export const getTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tasks = await Task.find({
      createdBy: req.user._id,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};



export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({
        message: "Task not found",
      });
      return;
    }

    // ownership check
    if (task.createdBy.toString() !== req.user._id.toString()) {
      res.status(403).json({
        message: "Not authorized",
      });
      return;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};


// DELETE TASK
export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({
        message: "Task not found",
      });
      return;
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      res.status(403).json({
        message: "Not authorized",
      });
      return;
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};