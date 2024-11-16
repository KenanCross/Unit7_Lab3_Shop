import { MongoClient, ObjectId } from "mongodb";
import { Router } from "express";
import dotenv from "dotenv";
import { loadCollection, errorResponse } from "../functions/functions";

dotenv.config();
const router = Router();
const client = new MongoClient(process.env.MONGODB_URI!);

router.get("/products", async (req, res) => {
	try {
		await client.connect();
		const collection = await loadCollection(client, "products");
		const query: any = {};

		if (req.query["max-price"]) {
			query.price = { $lte: parseInt(req.query["max-price"] as string, 10) };
		}

		if (req.query.includes) {
			query.name = { $regex: new RegExp(req.query.includes as string, "i") };
		}

		if (req.query.limit) {
			query.name = { $limit: parseInt(req.query.limit as string, 10) };
		}

		const products = await collection.find({ query }).toArray(); //run query on MongoDB Collection and return as Array for JSON manipulation
		res.status(200).json(products);
	} catch (error) {
		errorResponse(error, res);
	} finally {
		await client.close();
	}
});

router.get("/products/:id", async (req, res) => {
	try {
		await client.connect();
		const collection = await loadCollection(client, "products");
		const id = req.params.id;

		const result = await collection.find({ _id: new ObjectId(id) }).toArray();
		if (result.length === 0) {
			res.status(404).json({ message: "Product not found" });
		} else {
			res.status(200).json(result);
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	} finally {
		await client.close();
	}
});

router.post("/products", async (req, res) => {
	try {
		await client.connect();
		const collection = await loadCollection(client, "products");
		const newProduct = req.body;
		const result = await collection.insertOne(newProduct);
		res
			.status(201)
			.json({ message: "Created", _id: result.insertedId, ...result });
	} catch (error) {
		errorResponse(error, res);
	} finally {
		await client.close();
	}
});

router.put("/products/:id", async (req, res) => {
	try {
		await client.connect();
		const collection = await loadCollection(client, "products");
		const updateProduct = req.body;
		const result = await collection.updateOne(
			{ _id: new ObjectId(req.params.id) },
			{ $set: updateProduct }
		);
		if (result.matchedCount === 0) {
			res.status(404).json({ message: "Product not found" });
		} else {
			res.status(200).json({ ...result });
		}
	} catch (error) {
		errorResponse(error, res);
	} finally {
		await client.close();
	}
});

router.delete("/products/:id", async (req, res) => {
	try {
		await client.connect();
		const collection = await loadCollection(client, "products");
		const result = await collection.deleteOne({
			_id: new ObjectId(req.params.id),
		});
		if (result.deletedCount === 0) {
			res.status(404).json({ message: "No Product found with that ID" });
		} else {
			res.status(204).json({ message: "Product Deleted" });
		}
	} catch (error) {
		errorResponse(error, res);
	} finally {
		await client.close();
	}
});

export default router;
