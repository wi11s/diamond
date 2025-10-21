export const metadata = {
  title: 'Bio — Taylor Diamond',
  description: 'About Taylor Diamond — multimedia artist and educator',
}

export default function BioPage() {
  return (
    <div className="min-h-screen bg-white text-black px-6 pt-24 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Bio</h1>
        <div className="space-y-5 text-sm leading-7 text-black/90">
          <p>
            Taylor Diamond is a Brooklyn-based multimedia artist and educator working across analog photography,
            filmmaking, and music culture. His practice is rooted in storytelling through analog processes, driven by a
            desire to create work that feels raw, real, and connected to both lived experience and a deep sense of
            spirituality. Taylor is drawn to capturing the beauty in travel, music, fashion, and collaborative art,
            using the imperfections of film and tape to hold onto moments that might otherwise slip away. In the same
            spirit, Taylor DJs as another way of building community — creating spaces where people can gather, share,
            and appreciate art together through sound and movement.
          </p>
          <p>
            Growing up in Atlanta, Taylor was deeply shaped by the arts programs and teachers who set them on a creative
            path. Carrying this inspiration forward alongside ongoing projects, Taylor continues to work as an arts
            educator through the American Museum of the Moving Image and directly with New York City schools, helping
            young people find their voices through filmmaking, animation, and music.
          </p>
          <p>
            Taylor’s photography has been published in Dekopon Magazine, and the short film <em>Rockaway</em> screened at the
            Press Pause Film Festival in Queens, as well as Scores for the Silver Screen Festival in Miami, where it
            received Best Score and 3rd Best Film. Taylor has collaborated with musicians, fashion brands, and artists
            including Zemeta, Heaven’s Gate, Zambra Jazz Collective, Cash$tarr, BAGH, Ka$hKenni, Tomcbumpz, Justend, and
            Lexxie Mathis, bringing a shared sensibility into collaborative projects. This work is rooted in over 5 years
            of experience as both a Production Assistant and a 1st Assistant Director on over 8 narrative film
            productions.
          </p>
          <p>
            As DJ Diamond Cutz, Taylor has had the opportunity to perform and collaborate at both local venues and on a
            national stage. In the past, you might have seen Taylor at Pianos, Reforesters Lab, Museum of the Moving
            Image, Jade Bar, Purgatory, Casa Maya, or out on a rooftop. In 2024, Taylor joined the <em>we were so
            beautiful</em> tour with SEB and Justend in Washington D.C., New York City, and Chicago. Music curated by Taylor
            Diamond and Maureen Thedford can currently be heard in the Museum of the Moving Image lobby during open
            hours.
          </p>
          <p>
            Creating the work showcased here has been a true treasure for Taylor, and he hopes you enjoy experiencing it
            as much as he’s loved making it.
          </p>
        </div>

        <div className="mt-10">
          <a href="mailto:taylor.diamond10@gmail.com" className="underline">Contact</a>
        </div>
      </div>
    </div>
  )
}
