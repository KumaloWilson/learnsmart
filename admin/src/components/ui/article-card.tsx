"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"
import { ArrowRight, Clock } from "lucide-react"
import { HoverCardEffect } from "./hover-card-effect"

interface ArticleCardProps {
  id: string
  title: string
  category: string
  excerpt: string
  image: string
  date: string
  readTime: number
  slug: string
  author: string
  featured?: boolean
}

export function ArticleCard({
  title,
  category,
  excerpt,
  image,
  date,
  readTime,
  slug,
  author,
  featured = false,
}: ArticleCardProps) {
  return (
    <HoverCardEffect glowColor="rgba(76, 175, 80, 0.2)" borderColor="rgba(76, 175, 80, 0.3)" intensity="medium">
      <Card className="h-full flex flex-col overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700"
            style={{
              transform: "scale(1.01)", // Slight scale to avoid white edges during animation
            }}
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
            <Badge variant="outline" className="text-secondary border-secondary">
              {category}
            </Badge>
            <span className="text-xs text-muted-foreground">{formatDate(new Date(date))}</span>
          </div>
          <CardTitle className="text-xl line-clamp-2 group-hover:text-secondary transition-colors">{title}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span>By {author}</span>
            <span className="flex items-center text-xs">
              <Clock className="h-3 w-3 mr-1" /> {readTime} min read
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent hover:text-secondary group w-full justify-start"
            asChild
          >
            <Link href={`/knowledge-hub/${slug}`} className="flex items-center">
              Read Article
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
