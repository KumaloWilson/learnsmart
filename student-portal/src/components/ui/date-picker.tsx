"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  id?: string
  selected?: Date
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

export function DatePicker({
  id,
  selected,
  onSelect,
  placeholder = "Pick a date",
  disabled = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !selected && "text-muted-foreground")}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
          disabled={disabled}
          fromDate={minDate}
          toDate={maxDate}
        />
      </PopoverContent>
    </Popover>
  )
}
