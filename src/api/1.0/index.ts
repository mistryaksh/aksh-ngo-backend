import { Express } from "express";
import { IController } from "../../interface";
import {
     AdminController,
     ApiController,
     BlogController,
     ContactController,
     EventCategoryController,
     EventController,
     GalleryController,
     WebsiteController,
     DonationController,
} from "./controller";

const routesHandler = (express: Express, controller: IController) => {
     for (const route of controller.routes) {
          const middleware = route.middleware || [];
          switch (route.method) {
               case "GET":
                    express.get(`/api/1.0${route.path}`, ...middleware, route.handler);
                    break;
               case "POST":
                    express.post(`/api/1.0${route.path}`, ...middleware, route.handler);
                    break;
               case "PUT":
                    express.put(`/api/1.0${route.path}`, ...middleware, route.handler);
                    break;
               case "DELETE":
                    express.delete(`/api/1.0${route.path}`, ...middleware, route.handler);
                    break;
               default:
                    break;
          }
     }
};

export const registerRoutesV1 = (express: Express) => {
     routesHandler(express, new ApiController());
     routesHandler(express, new AdminController());
     routesHandler(express, new EventCategoryController());
     routesHandler(express, new EventController());
     routesHandler(express, new ContactController());
     routesHandler(express, new WebsiteController());
     routesHandler(express, new BlogController());
     routesHandler(express, new GalleryController());
     routesHandler(express, new DonationController());
};
