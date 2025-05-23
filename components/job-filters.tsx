"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export type FilterState = {
  jobType: string[]
  experienceLevel: string[]
  salaryRange: [number, number]
  location: string[]
  skills: string[]
  education: string[]
}

interface JobFiltersProps {
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

export function JobFilters({ onFilterChange, initialFilters }: JobFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(
    () =>
      initialFilters || {
        jobType: [],
        experienceLevel: [],
        salaryRange: [50000, 150000],
        location: [],
        skills: [],
        education: [],
      },
  )

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleCheckboxChange = (category: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[category] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]

      return {
        ...prev,
        [category]: newValues,
      }
    })
  }

  const handleSalaryChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      salaryRange: [value[0], value[1]],
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Filters</h3>
        <Accordion type="multiple" defaultValue={["job-type", "experience", "salary"]}>
          <AccordionItem value="job-type">
            <AccordionTrigger>Job Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {[
                  { id: "full-time", label: "Full-time" },
                  { id: "part-time", label: "Part-time" },
                  { id: "contract", label: "Contract" },
                  { id: "internship", label: "Internship" },
                  { id: "temporary", label: "Temporary" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={filters.jobType.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked !== "indeterminate") {
                          handleCheckboxChange("jobType", item.id)
                        }
                      }}
                    />
                    <Label htmlFor={item.id} className="font-normal">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="experience">
            <AccordionTrigger>Experience Level</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {[
                  { id: "entry-level", label: "Entry Level" },
                  { id: "mid-level", label: "Mid Level" },
                  { id: "senior-level", label: "Senior Level" },
                  { id: "director", label: "Director" },
                  { id: "executive", label: "Executive" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={filters.experienceLevel.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked !== "indeterminate") {
                          handleCheckboxChange("experienceLevel", item.id)
                        }
                      }}
                    />
                    <Label htmlFor={item.id} className="font-normal">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="salary">
            <AccordionTrigger>Salary Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  value={[filters.salaryRange[0], filters.salaryRange[1]]}
                  min={0}
                  max={300000}
                  step={5000}
                  onValueChange={handleSalaryChange}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">${filters.salaryRange[0].toLocaleString()}</span>
                  <span className="text-sm">${filters.salaryRange[1].toLocaleString()}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="location">
            <AccordionTrigger>Location</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {[
                  { id: "remote", label: "Remote" },
                  { id: "hybrid", label: "Hybrid" },
                  { id: "on-site", label: "On-site" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={filters.location.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked !== "indeterminate") {
                          handleCheckboxChange("location", item.id)
                        }
                      }}
                    />
                    <Label htmlFor={item.id} className="font-normal">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="skills">
            <AccordionTrigger>Skills</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {[
                  { id: "javascript", label: "JavaScript" },
                  { id: "react", label: "React" },
                  { id: "python", label: "Python" },
                  { id: "java", label: "Java" },
                  { id: "sql", label: "SQL" },
                  { id: "aws", label: "AWS" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={filters.skills.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked !== "indeterminate") {
                          handleCheckboxChange("skills", item.id)
                        }
                      }}
                    />
                    <Label htmlFor={item.id} className="font-normal">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="education">
            <AccordionTrigger>Education</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {[
                  { id: "high-school", label: "High School" },
                  { id: "associate", label: "Associate Degree" },
                  { id: "bachelor", label: "Bachelor's Degree" },
                  { id: "master", label: "Master's Degree" },
                  { id: "doctorate", label: "Doctorate" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={filters.education.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked !== "indeterminate") {
                          handleCheckboxChange("education", item.id)
                        }
                      }}
                    />
                    <Label htmlFor={item.id} className="font-normal">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
