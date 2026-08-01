import CreateProjectModal from "./createProject";
import Projects from "./Project";

export default function Project(){

    return (<div>
        
        <Projects/>
        <div className=" p-1 ml-8  md:ml-34">
             <CreateProjectModal/>
        </div>
       </div>
    )
}