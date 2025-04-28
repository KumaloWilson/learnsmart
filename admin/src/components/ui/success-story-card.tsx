"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { HoverCardEffect } from "./hover-card-effect"

interface SuccessStoryCardProps {
  id: string
  title: string
  clientName: string
  clientType: string
  excerpt: string
  image: string
  date: string
  slug: string
  featured?: boolean
}

export function SuccessStoryCard({
  title,
  clientName,
  clientType,
  excerpt,
  image,
  date,
  slug,
  featured = false,
}: SuccessStoryCardProps) {
  return (
    <HoverCardEffect glowColor="rgba(138, 43, 226, 0.2)" borderColor="rgba(138, 43, 226, 0.3)" intensity="medium">
      <Card className="h-full flex flex-col overflow-hidden bg-card/50 backdrop-blur-sm group">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"
            whileHover={{ opacity: 0.3, transition: { duration: 0.5 } }}
          />
          {featured && (
            <div className="absolute top-4 right-4 z-10">
              <Badge className="bg-accent text-accent-foreground shadow-md">Featured</Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className="text-primary border-primary">
              {clientType}
            </Badge>
            <span className="text-xs text-muted-foreground">{formatDate(new Date(date))}</span>
          </div>
          <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">{title}</CardTitle>
          <CardDescription className="font-medium text-primary">{clientName}</CardDescription>
        </CardHeader>

        <CardContent className="flex-grow pb-2">
          <p className="text-muted-foreground line-clamp-3">
            {excerpt || "A success story of how we helped this client achieve their NDIS compliance goals."}
          </p>
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent hover:text-primary group w-full justify-start"
            asChild
          >
            <Link href={`/success-stories/${slug}`} className="flex items-center">
              Read Full Story
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
