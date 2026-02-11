import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { BlogHero } from '../components/BlogSection/Hero.jsx';
import { BlogArticle } from '../components/BlogSection/RecentArticle.jsx';

export const Blog = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />

            <main>
                <BlogHero />
                <BlogArticle />
            </main>

            <Footer />
        </div>
    );
}