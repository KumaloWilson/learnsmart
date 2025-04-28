"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Download, FileText, FileArchive, FileSpreadsheet } from "lucide-react"
import { HoverCardEffect } from "./hover-card-effect"

interface ResourceCardProps {
  id: string
  title: string
  type: string
  description: string
  downloadUrl: string
  image: string
  category: string
}

export function ResourceCard({  title, type, description, downloadUrl, image, category }: ResourceCardProps) {
  // Choose icon based on resource type
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case "pdf guide":
      case "guide":
        return <FileText className="h-5 w-5" />
      case "template":
        return <FileSpreadsheet className="h-5 w-5" />
      case "framework":
      case "checklist":
        return <FileArchive className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <HoverCardEffect glowColor="rgba(255, 193, 7, 0.2)" borderColor="rgba(255, 193, 7, 0.3)" intensity="medium">
      <Card className="h-full flex flex-col overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="relative w-full h-40 overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700"
            style={{
              transform: "scale(1.01)",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"
            whileHover={{ opacity: 0.3, transition: { duration: 0.5 } }}
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className="text-accent border-accent flex items-center gap-1">
              {getIcon()}
              {type}
            </Badge>
            <Badge variant="secondary">{category}</Badge>
          </div>
          <CardTitle className="text-xl line-clamp-2 group-hover:text-accent transition-colors">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <p className="text-muted-foreground line-clamp-3">{description}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="outline"
            className="w-full hover:bg-accent hover:text-accent-foreground transition-colors border-accent/30 text-accent"
            asChild
          >
            <Link href={downloadUrl} className="flex items-center justify-center">
              <motion.div
                className="inline-flex items-center"
                whileHover={{ y: [0, -2, 0] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              >
                <Download className="mr-2 h-4 w-4" /> Download Resource
              </motion.div>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </HoverCardEffect>
  )
}
