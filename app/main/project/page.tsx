import CreateProjectModal from "./createProject";
import Projects from "./Project";

export default function Project(){

    return (<div>
        
        <Projects/>
        <div className="p-3 ml-3">
             <CreateProjectModal/>
        </div>
       </div>
    )
}