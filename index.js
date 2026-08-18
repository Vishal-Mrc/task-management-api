const express = require("express");
const { Firestore } = require("@google-cloud/firestore");

const app = express();
const db = new Firestore();

const PORT = process.env.PORT || 8080;
const tasksCollection = db.collection("tasks");

app.use(express.json());


// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy"
    });
});


// GET all tasks
app.get("/tasks", async (req, res) => {
    try {
        const snapshot = await tasksCollection.orderBy("createdAt", "desc").get();

        const tasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error getting tasks:", error);

        res.status(500).json({
            error: "Failed to retrieve tasks"
        });
    }
});


// GET one task
app.get("/tasks/:id", async (req, res) => {
    try {
        const doc = await tasksCollection.doc(req.params.id).get();

        if (!doc.exists) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json({
            id: doc.id,
            ...doc.data()
        });
    } catch (error) {
        console.error("Error getting task:", error);

        res.status(500).json({
            error: "Failed to retrieve task"
        });
    }
});


// CREATE task
app.post("/tasks", async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                error: "Title is required"
            });
        }

        const task = {
            title,
            description: description || "",
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await tasksCollection.add(task);

        res.status(201).json({
            id: docRef.id,
            ...task
        });
    } catch (error) {
        console.error("Error creating task:", error);

        res.status(500).json({
            error: "Failed to create task"
        });
    }
});


// UPDATE task
app.put("/tasks/:id", async (req, res) => {
    try {
        const taskRef = tasksCollection.doc(req.params.id);

        const doc = await taskRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        const { title, description, status } = req.body;

        const updates = {
            updatedAt: new Date().toISOString()
        };

        if (title !== undefined) {
            updates.title = title;
        }

        if (description !== undefined) {
            updates.description = description;
        }

        if (status !== undefined) {
            updates.status = status;
        }

        await taskRef.update(updates);

        const updatedDoc = await taskRef.get();

        res.status(200).json({
            id: updatedDoc.id,
            ...updatedDoc.data()
        });
    } catch (error) {
        console.error("Error updating task:", error);

        res.status(500).json({
            error: "Failed to update task"
        });
    }
});


// DELETE task
app.delete("/tasks/:id", async (req, res) => {
    try {
        const taskRef = tasksCollection.doc(req.params.id);

        const doc = await taskRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        const deletedTask = {
            id: doc.id,
            ...doc.data()
        };

        await taskRef.delete();

        res.status(200).json({
            message: "Task deleted successfully",
            task: deletedTask
        });
    } catch (error) {
        console.error("Error deleting task:", error);

        res.status(500).json({
            error: "Failed to delete task"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Task API listening on port ${PORT}`);
});