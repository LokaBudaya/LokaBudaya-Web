"use client"

import ArticleContent from "@/components/ArticleContent"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/ui/Footer"

export default function ArticlePage() {
    return (
        <div>
            <Navbar></Navbar>
            <ArticleContent></ArticleContent>
            <Footer></Footer>
        </div>
    )
}