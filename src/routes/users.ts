import { MongoClient, ObjectId } from "mongodb";
import { Router } from "express";
import dotenv from "dotenv";
import { errorResponse, loadCollection } from "../functions/functions";

dotenv.config();
const router = Router();
const client = new MongoClient(process.env.MONGODB_URI!);

router.get("/users/:id", async (req, res) => {
	try {
		await client.connect();
		const collection = await loadCollection(client, "users");
		const user = await collection
			.find({ _id: new ObjectId(req.params.id) })
			.toArray();
		if (user.length === 0) {
			res.status(404).json({ message: "No user found" });
		}
		res.status(200).json(user);
	} catch (error) {
		errorResponse(error, res);
	} finally {
		await client.close();
	}
});

router.post("/users", async (req, res) => {
	try {
		await client.connect();
		const collection = await loadCollection(client, "users");
		const createdUser = await collection.insertOne(req.body);
		res.status(201).json({ ...createdUser });
	} catch (error) {
	} finally {
		await client.close();
	}
});

router.put("/users/:id", async (req, res) => {
	try {
		await client.connect();
		const collection = await loadCollection(client, "users");
		const result = await collection.updateOne(
			{ _id: new ObjectId(req.params.id) },
			{ $set: req.body }
		);
	} catch (error) {
		errorResponse(error, res);
	} finally {
		await client.close();
	}
});

router.delete("/users/:id", async (req, res) => {
	try {
		await client.connect();
		const collection = await loadCollection(client, "users");
		const result = await collection.deleteOne({
			_id: new ObjectId(req.params.id),
		});
		if (result.deletedCount === 0) {
			res.status(404).json({ message: "User Not Found" });
		} else {
			res.status(204).json({ message: "User deleted." });
		}
	} catch (error) {
	} finally {
		await client.close();
	}
});

export default router;