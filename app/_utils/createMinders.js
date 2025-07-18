import connectMongoDB from "@lib/mongoDB";
import Minder from "@models/minderModel";

export async function createBlog(data) {
  try {
    await connectMongoDB();
    const newBlog = await Minder.create(data);
    return {
      statusText: "success",
      message: "Blog created successfully",
      data: newBlog,
    };
  } catch (err) {
    return {
      statusText: "error",
      message: "Blog creating User",
      error: err.message,
    };
  }
}
