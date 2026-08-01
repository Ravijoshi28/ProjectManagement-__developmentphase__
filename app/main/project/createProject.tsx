"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProject } from "@/app/frontendLib/projectlib/projectapi"
import { toast } from "sonner"


export default function CreateProjectModal() {
 
  const [formdata, setdata] = useState({ name: "", about: "" })
  const [open, setOpen] = useState(false)
 
  const clientQuery=useQueryClient();

const mutation=useMutation({
  mutationFn:createProject,
  onSuccess:()=>{
    clientQuery.invalidateQueries({
      queryKey:["projects"]
    })
  }
})
  const handleSubmit = async(e: React.FormEvent) => {
    try{
       mutation.mutateAsync(formdata);
        toast.success("Project created")
    }catch(error){
      toast.error("Project not created...")
    }
   
    
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 1. Correctly using 'asChild' on DialogTrigger.
        2. No native <Button> wrapping the Card anymore, keeping HTML clean!
      */}
      <DialogTrigger >
        <Card className="flex flex-col items-center justify-center border-dashed border-2 border-muted hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all duration-400 h-full min-h-[220px] rounded-xl p-6 text-center group">
          <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-3">
            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
            Create New Project
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Get started on something new
          </p>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-xl shadow-2xl border border-muted bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-xl font-bold tracking-tight">Create Project</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Enter the structural details below to initialize your project workspace.
            </DialogDescription>
          </DialogHeader>

          {/* Form Input fields */}
          <div className="grid gap-5 py-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Name of the Project
              </Label>
              <Input
                id="name"
                value={formdata.name}
                onChange={(e) => setdata({ ...formdata, name: e.target.value })}
                placeholder="e.g., Marketing Campaign"
                className="h-10 rounded-lg border-muted bg-background focus-visible:ring-primary"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="about" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                About / Description
              </Label>
              <Input
                id="about"
                value={formdata.about}
                placeholder="Brief summary of the goals..."
                onChange={(e) => setdata({ ...formdata, about: e.target.value })}
                className="h-10 rounded-lg border-muted bg-background focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Action Row */}
          <DialogFooter className="gap-2 sm:gap-0 border-t border-muted pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="rounded-lg text-xs font-medium"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="rounded-lg text-xs font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}