"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"
import { ArrowRight, Calendar } from "lucide-react"
import { HoverCardEffect } from "./hover-card-effect"

interface UpdateCardProps {
  id: string
  title: string
  date: string
  summary: string
  link: string
  category: string
}

export function UpdateCard({ title, date, summary, link, category }: UpdateCardProps) {
  return (
    <HoverCardEffect glowColor="rgba(138, 43, 226, 0.2)" borderColor="rgba(138, 43, 226, 0.3)" intensity="medium">
      <Card className="h-full flex flex-col overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className="text-primary border-primary">
              {category}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(new Date(date))}
            </div>
          </div>
          <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <p className="text-muted-foreground line-clamp-3">{summary}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent hover:text-primary group w-full justify-start"
            asChild
          >
            <Link href={`/knowledge-hub/updates/${link}`} className="flex items-center">
              Read Update
              <motion.div
                className="inline-block ml-2"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </HoverCardEffect>
  )
}
