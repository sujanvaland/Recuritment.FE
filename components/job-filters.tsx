"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export type FilterState = {
  jobType: string[]

  salaryRange: [number, number]
  location: string[]
  skills: string[]

}

interface JobFiltersProps {
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
  selectedFilters?: FilterState // <-- Add this line
}

export function JobFilters({ onFilterChange, initialFilters, selectedFilters }: JobFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(
    () =>
      selectedFilters ||
      initialFilters || {
        jobType: [],
        salaryRange: [50000, 150000],
        location: [],
        skills: [],
      },
  )

  // Sync local state with selectedFilters if provided (controlled)
  useEffect(() => {
    if (selectedFilters) {
      setFilters(selectedFilters)
    }
  }, [selectedFilters])

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
        <Accordion type="multiple" defaultValue={["job-type", "salary", "location", "skills"]}>
          {/* Job Type */}
          <AccordionItem value="job-type">
            <AccordionTrigger>Job Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {initialFilters?.jobType.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`job-type-${type}`}
                      checked={filters.jobType.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked !== "indeterminate") {
                          handleCheckboxChange("jobType", type);
                        }
                      }}
                    />
                    <Label htmlFor={`job-type-${type}`} className="font-normal">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Salary */}
          <AccordionItem value="salary">
            <AccordionTrigger>Salary Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  value={[filters.salaryRange[0], filters.salaryRange[1]]}
                  min={0}
                  max={initialFilters?.salaryRange[1]}
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

          {/* Location */}
          <AccordionItem value="location">
            <AccordionTrigger>Location</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {initialFilters?.location.map((loc) => (
                  <div key={loc} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${loc}`}
                      checked={filters.location.includes(loc)}
                      onCheckedChange={(checked) => {
                        if (checked !== "indeterminate") {
                          handleCheckboxChange("location", loc);
                        }
                      }}
                    />
                    <Label htmlFor={`location-${loc}`} className="font-normal">
                      {loc}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Skills */}
          <AccordionItem value="skills">
            <AccordionTrigger>Skills</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {initialFilters?.skills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill}`}
                      checked={filters.skills.includes(skill)}
                      onCheckedChange={(checked) => {
                        if (checked !== "indeterminate") {
                          handleCheckboxChange("skills", skill);
                        }
                      }}
                    />
                    <Label htmlFor={`skill-${skill}`} className="font-normal">
                      {skill}
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
