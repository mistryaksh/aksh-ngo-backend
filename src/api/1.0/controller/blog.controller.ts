import { Request, Response } from "express";
import { IBlogProps, IController, IControllerRoutes } from "../../../interface";
import { BLOG_PREFIX, GetJwtToken, Ok, UnAuthorized, VerifyJwtToken } from "../../../utils";
import { Admin, Blog } from "model";
import { AdminRoute } from "middleware";

export class BlogController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.UploadNewBlog,
               path: `/${BLOG_PREFIX}`,
               method: "POST",
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.GetAllBlogs,
               path: `/${BLOG_PREFIX}/all`,
               method: "GET",
          });
          this.routes.push({
               handler: this.GetBlogById,
               path: `/${BLOG_PREFIX}/:blogId`,
               method: "GET",
          });
          this.routes.push({
               handler: this.UpdateBlogById,
               path: `/${BLOG_PREFIX}/:blogId`,
               method: "PUT",
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.DeleteBlogById,
               path: `/${BLOG_PREFIX}/:blogId`,
               method: "DELETE",
               middleware: [AdminRoute],
          });
     }

     public async UploadNewBlog(req: Request, res: Response) {
          try {
               const { category, description, image, label }: IBlogProps = req.body;
               if (!category || !description || !image || !label) {
                    return UnAuthorized(res, "missing credentials");
               }
               const token = GetJwtToken(req);
               const verified = VerifyJwtToken(token);
               const admin = await Admin.findById({ _id: verified.id });
               const blog = await new Blog({
                    category,
                    description,
                    image,
                    label,
                    postedBy: admin._id,
               }).save();
               return Ok(res, `${blog.label} is created`);
          } catch (err) {
               return UnAuthorized(res, err as string);
          }
     }

     public async GetAllBlogs(req: Request, res: Response) {
          try {
               const blog = await Blog.find().sort({ createdAt: -1 }).populate("category").populate("postedBy");
               return Ok(res, blog);
          } catch (err) {
               console.log(err);
               return UnAuthorized(res, err);
          }
     }

     public async GetBlogById(req: Request, res: Response) {
          try {
               const blogId = req.params.blogId;
               const blog = await Blog.findOne({ _id: blogId });
               return Ok(res, blog);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async UpdateBlogById(req: Request, res: Response) {
          try {
               const blogId = req.params.blogId;
               const blog = await Blog.findOneAndUpdate({ _id: blogId }, { $set: { ...req.body } });
               return Ok(res, `${blog.label} is updated`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async DeleteBlogById(req: Request, res: Response) {
          try {
               const blogId = req.params.blogId;
               const blog = await Blog.findOneAndDelete({ _id: blogId });
               return UnAuthorized(res, "blog has been deleted");
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
