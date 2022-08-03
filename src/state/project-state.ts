import { Project, ProjectStatus } from '../models/project.js';

type Listiner<T> = (items: T[]) => void;

class State<T> {
    protected listiners: Listiner<T>[] = [];

    addListiner(listinerFn: Listiner<T>) {
        this.listiners.push(listinerFn);
    }

}

export class ProjectStateManagement extends State<Project>{
    private projects: Project[] = [];
    private static instance: ProjectStateManagement;

    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        } 
        this.instance = new ProjectStateManagement();
        return this.instance;
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project (
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        );
        this.projects.push(newProject);
        this.updateListiners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(el => el.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListiners();
        }
    }
    
    private updateListiners() {
        for (const listinerFn of this.listiners) {
            listinerFn(this.projects.slice());
        }
    }
}

export const projectState = ProjectStateManagement.getInstance();
