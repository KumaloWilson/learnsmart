"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FaqCardProps {
  id: string
  question: string
  answer: string
  category: string
}

export function FaqCard({  question, answer, category }: FaqCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className="h-full"
    >
      <Card
        className={`cursor-pointer transition-all duration-300 h-full bg-card/50 backdrop-blur-sm ${
          isOpen ? "border-primary shadow-lg shadow-primary/10" : "hover:border-primary/50"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Badge variant="outline" className="mb-2 text-primary border-primary">
                {category}
              </Badge>
              <h3 className="text-lg font-semibold">{question}</h3>
            </div>
            <motion.div
              className="ml-4 mt-1 bg-muted rounded-full p-1"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </motion.div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <CardContent className="p-4 pt-2">
                <p className="text-muted-foreground">{answer}</p>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
