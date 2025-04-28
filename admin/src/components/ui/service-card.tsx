"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { HoverCardEffect } from "./hover-card-effect"
import { motion } from "framer-motion"

interface ServiceCardProps {
  title: string
  description: string
  icon: string
  slug: string
}

export function ServiceCard({ title, description, icon, slug }: ServiceCardProps) {
  return (
    <HoverCardEffect glowColor="rgba(138, 43, 226, 0.2)" borderColor="rgba(138, 43, 226, 0.3)" intensity="medium">
      <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <motion.div
            className="mx-auto mb-4 rounded-full bg-primary/10 p-2 w-16 h-16 flex items-center justify-center"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(138, 43, 226, 0.2)",
              transition: { duration: 0.3 },
            }}
          >
            <Image src={icon || "/placeholder.svg"} alt={title} width={40} height={40} className="h-8 w-8" />
          </motion.div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="text-center">{description}</CardDescription>
        </CardContent>
        <CardFooter className="pt-0 flex justify-center">
          <Button
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-300"
            asChild
          >
            <Link href={`/services/${slug}`}>Learn More</Link>
          </Button>
        </CardFooter>
      </Card>
    </HoverCardEffect>
  )
}
