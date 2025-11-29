import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		metadata: {
			type: Object,
			default: {},
		},
	},
	{
		timestamps: true,
	}
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
