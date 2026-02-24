/**
 * Generate project content files from consolidated CSV, CV, and ODS data.
 * Run once: node scripts/generate-project-files.mjs
 *
 * Skips files that already exist (the 6 case-study MDX files).
 * Generates .md files with type (project/entry) and template (case-study/project) fields.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE = join(import.meta.dirname, '..', 'src', 'content', 'projects');

// ─── Helpers ────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeYaml(str) {
  if (!str) return '""';
  if (str.includes(':') || str.includes('#') || str.includes('"') || str.includes("'") || str.includes('\n')) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return str;
}

function buildFrontmatter(item) {
  const lines = ['---'];
  lines.push(`title: ${escapeYaml(item.title)}`);
  lines.push(`status: ${item.status || 'draft'}`);
  lines.push(`type: ${item.type}`);
  if (item.template) lines.push(`template: ${item.template}`);
  lines.push(`order: 99`);
  if (item.cover) {
    lines.push(`cover:`);
    lines.push(`  image: ${item.cover}`);
  }
  lines.push(`meta:`);
  lines.push(`  category: ${item.category}`);
  if (item.format) lines.push(`  format: ${escapeYaml(item.format)}`);
  if (item.institution) lines.push(`  institution: ${escapeYaml(item.institution)}`);
  if (item.year) lines.push(`  year: "${String(item.year)}"`);
  if (item.team) lines.push(`  team: ${escapeYaml(item.team)}`);
  if (item.role) lines.push(`  role: ${escapeYaml(item.role)}`);
  if (item.description) lines.push(`description: ${escapeYaml(item.description)}`);
  if (item.description_de) lines.push(`description_de: ${escapeYaml(item.description_de)}`);
  if (item.collaborators) lines.push(`collaborators: ${escapeYaml(item.collaborators)}`);
  if (item.curators) lines.push(`curators: ${escapeYaml(item.curators)}`);
  if (item.credits_image) lines.push(`credits_image: ${escapeYaml(item.credits_image)}`);
  if (item.student) lines.push(`student: ${escapeYaml(item.student)}`);
  if (item._todo) lines.push(`# todo: ${item._todo}`);
  lines.push('---');
  return lines.join('\n');
}

// ─── Master Project List ────────────────────────────────────────────
// Consolidated from CSV, CV appendices, and ODS
const projects = [

  // ═══════════════════════════════════════════════════════════════════
  // RESEARCH — projects (with detail page)
  // ═══════════════════════════════════════════════════════════════════
  {
    title: 'False Colours',
    type: 'project',
    template: 'project',
    category: 'research',
    format: 'Installation',
    year: '2019',
    institution: 'Forecast Forum',
    collaborators: 'Andrea Karch',
    curators: 'Paolo Cirio',
    team: 'confusion of tongues',
    description: 'False Colours is an installation consisting of four performances, a glass membrane and a picture frame holding two reproduced documents. The first document in the picture frame is an image produced by a European border guard. It was submitted to the 2014 photo competition of the European Border and Coast Guard Agency (Frontex). The second document is the award-certificate for the image, handed out during the competitions award ceremony. The four performances relate this image to four documents from core areas of Frontex\'s image production and expose Frontex\'s linguistic and rhetorical handling of (operational) image material.',
  },
  {
    title: 'Figure of Teach',
    type: 'project',
    template: 'project',
    category: 'research',
    format: 'Installation, Performance',
    year: '2018',
    institution: 'Dialogfelder',
    team: 'confusion of tongues',
    description: 'Figure of Teach is a participatory performance in which the audience physically experiences a diagram of the right-wing intellectual Jordan Peterson. In this meditation we feel into the dichotomies of order and chaos, of masculinity and femininity that he postulates. Participants are given the opportunity to express themselves on white panels leaning on the gallery walls. After the performance the chaos is cleaned up by a robot vacuum cleaner and the painted panels are hung up for presentation in the gallery.',
  },
  {
    title: 'The Power of Mesh',
    type: 'project',
    template: 'project',
    category: 'research',
    format: 'Installation, Interaction Design, Poster',
    year: '2014',
    institution: 'Festival du Graphisme Chaumont',
    collaborators: 'Gilles de Brock, Marthe Prins',
    description: 'Starting from the ideal of a decentralized alternative internet based on "wireless networks", "The Power of Mesh" deals with companies, states and NGOs that use this infrastructure for their own programs. During the "Festival du Graphisme Chaumont", a local mesh network presented a non-linear story that showed the interdependencies between DIY activists, data collectors, cultural colonists, hardware providers and decentralization advocates. Using a smartphone, people could log into various hotspots on the festival grounds. A poster installation provided additional information about the five actors.',
    description_de: 'Ausgehend von dem Ideal eines dezentralen alternativen Internets, basierend auf „Wireless Networks", beschäftigt sich „The Power of Mesh" mit Unternehmen, Staaten und NGOs, die diese Infrastruktur für eine eigene Programme nutzen. Während dem „Festival du Graphisme Chaumont" präsentierte ein lokales Mesh-Netzwerk eine nichtlineare Geschichte, die die Abhängigkeiten zwischen DIY-Aktivisten, Datensammlern, Kultur-Kolonisten, Hardware-Versorgern und Dezentralisierungs-Befürwortern zeigten.',
  },
  {
    title: 'More Free Wifi',
    type: 'project',
    template: 'project',
    category: 'research',
    format: 'Installation, Poster Design, Website',
    year: '2014',
    collaborators: 'Gilles de Brock, Marthe Prins',
    description: '"More Free Wifi" is an investigation into alternative forms of network-based communication. As a group, we started our investigation by acquiring the knowledge to build our own mesh network. To do this, we met with various freifunk associations in Germany and the Netherlands. Questions and answers that arose from the dialog with the associations were transmitted to a neighbouring building with the help of the self-built antennas and visually displayed there. The project was developed during the first semester of my master program at the Sandberg Instituut Amsterdam.',
    description_de: '„More Free Wifi" ist eine Untersuchung zu alternativen Formen der Netzwerkbasierten Kommunikation. Als Gruppe haben wir unsere Untersuchungen damit begonnen uns das Wissen anzueignen, ein eigenes Mesh-Netzwerk zu bauen. Dafür trafen wir uns mit verschiedenen Freifunkverbänden in Deutschland und den Niederlanden. Fragen und Antworten, die aus dem Dialog mit den Verbänden entstanden sind, wurden Mithilfe der selbstgebauten Antennen in ein Nachbargebäude übermittelt und dort visuell dargestellt. Das Projekt entstand während des ersten Semesters meines Masterstudiengangs am Sandberg Instituut Amsterdam.',
  },
  {
    title: 'Triple Digest: Creative Destruction',
    type: 'project',
    template: 'project',
    category: 'research',
    format: 'Installation, Performance',
    year: '2018',
    institution: 'Dialogfelder',
    collaborators: 'Dr. Raphael Schwegmann',
    team: 'confusion of tongues',
    description: 'Triple Digest: Creative Destruction is a short lecture-performance assembled from three youtube videos that reconstruct Alois Schumpeter\'s influential lecture on "creative destruction". Urbanism researcher Raphael Schweegmann performed this lecture three times a day at the classical times of main meals: morning, noon and evening. He was locked inside the gallery and drew an explanatory graphic on the window.',
  },
  {
    title: 'Sanity is Something Better Outsourced',
    type: 'project',
    template: 'project',
    category: 'research',
    format: 'Installation, Performance',
    year: '2018',
    institution: 'Dialogfelder',
    team: 'confusion of tongues',
    description: 'Sanity is Something Better Outsourced was created during a residency in Chemnitz, an east-german city at the time running up to become European Capital of Culture. In this context we dealt with the city\'s wishes for revaluation, while exploring its instrumentalization by right-wing intellectuals: In particular the diffuse relationship-systems used in academic publications concerned with right-wing ideologies of cleanliness and "creative destruction". In three performances we dedicate ourselves to a radical right-wing movement that flirts with academic rhetoric.',
  },
  {
    title: 'No Exit',
    type: 'project',
    template: 'project',
    category: 'research',
    format: 'Installation, Movie',
    year: '2016',
    institution: '27th Brno Biennial, Graphic Design Festival Glasgow',
    team: 'Design Displacement Group',
    description: 'No Exit is a generative work that explores a post-signature methodology. A system running off HTML, JavaScript, and code libraries generates arias, librettos, and dialogue from a database of sound and voice recordings. In five acts, music is generated by DDG and synchronized with videos and constructed images. The opera approaches the idea of "No Exit" through design — exploring the connections and realities of a collaborative design practice within a political landscape moving toward separation and isolation.',
    description_de: 'No Exit ist ein generatives Werk, das eine Post-Signatur-Methodik untersucht. Ein System, das aus HTML, JavaScript und Codebibliotheken läuft, erzeugt Arien, Librettos und Dialoge aus einer Datenbank mit Ton- und Sprachaufnahmen. In fünf Akten wird von der DDG Musik erzeugt und mit Videos und konstruierten Bildern synchronisiert.',
  },
  {
    title: 'Landing Platform for the Flir Systems Black Hornet Nano UAV',
    type: 'project',
    template: 'project',
    category: 'research',
    format: 'Sculpture',
    year: '2019',
    curators: 'Merle Dammhayn',
    team: 'confusion of tongues',
    credits_image: 'Merle Dammhayn',
    description: 'Plaster piece on nail developed for the group show "Nailing it: A ten finger exhibition on future tackles". The Black Hornet is a tiny helicopter-shaped drone produced for both consumer and military market. It uses photographical AI for image production. During Brussels Gallery Weekend it propels image operations, always touching base on the artists\' middle-fingernail.',
  },
  {
    title: 'Moving Membranes',
    type: 'project',
    template: 'project',
    category: 'research',
    format: 'Design Research',
    year: '2018–2020',
    institution: 'Creative Industries Fund NL, KABK & Leiden University',
    team: 'confusion of tongues',
    description: 'Moving Membranes explores the aesthetic functions of image operations at the EU\'s borders. The project was funded by the Creative Industries Fund NL (start-up grant 2018, project grant 2019) and connected to KABK and Leiden University\'s Lectorate Design and the Deep Future (Alice Twemlow). Results were presented at Video Vortex 12 Malta, Stroom Den Haag, and London College of Communication.',
  },

  // ═══════════════════════════════════════════════════════════════════
  // RESEARCH — entries (table row only)
  // ═══════════════════════════════════════════════════════════════════
  {
    title: 'Item to Item',
    type: 'entry',
    category: 'research',
    format: 'Algorithm, Installation',
    year: '2015',
    institution: 'Sandberg Instituut',
    collaborators: 'Gilles de Brock',
    description: 'How smart and seductive are algorithms on the internet who are made to sell products to us? "Any intelligence is prediction" says Yann LeCun Director of AI Research, Facebook. This predictive Intelligence is mostly used to analyze our behavior and turn it into semiotic capital \u2013 into "big data". Item to item is an experiment which turns this process around. It uses recommendations \u2013 the predictions of our future consumption \u2013 to render a person. The question hereby is what is the intelligence of algorithms who run our daily life on the internet and how far are they biased towards certain kinds of target groups? Item to Item uses the most advanced intelligent products from Amazon, Youtube, Walmart or Ikea to render average people and their daily routines.',
  },
  {
    title: 'Be the First Person to Like This',
    type: 'entry',
    category: 'research',
    format: 'Video',
    year: '2014',
    description: 'Youtube reported, that in 2015 users uploaded 400 hours of content every minute to their platform. That adds up to 65 years of content every day. Amongst those video a fight for attention, clicks, view, recommendations, reactions and comments is fought. Every human and bot is participating and paying with views. "Be the first person to like this" composes new videos out of videos nobody ever reached browsing youtube. Zero-view-videos. An undiscovered area by humans and algorithms.',
  },
  {
    title: 'Neo Lythic',
    type: 'entry',
    category: 'research',
    format: 'Video',
    year: '2014',
    description: 'This is the first experiment in using Youtube in a new way of algorithmic story telling. The videos of this series are all found footage movies. Completely selected and montaged by an algorithm. This movie investigates the reoccurring terms from the Neolithic age today in the context of new software. We crawl, scrape, dig, carve and mine again using numbers instead of stones. This project analyses the descriptive vocabulary of the neolithic and applies it to contemporary technology. It uses both pools of videos to montage a dialog between both areas of technology.',
  },
  {
    title: 'Liquid Assemblage',
    type: 'entry',
    category: 'research',
    format: 'Interaction Design',
    year: '2016',
    description: 'Algorithms are increasingly replacing decisions which ought to be made by humans. So called predictive analysis assemble and calculate collected data about humans and companies to make predictions about the future. This happens often without most of the people knowing about it. \u201ELiquid Assemblage\u201C is an app which allows you to meander between the lulling stream of technological sublime, the nostalgia of remembering long lost moments and the prospects of a new self in a near future. It is the data you want to hang above your couch. \u201ELiquid Assemblage\u201C is a new way of depiction of our daily life, from a machine perspective. a Startup, App and a piece of Art. It is explaining us our being by preforming apophenia on our quantified selfs. In return its aura of technological sublime allows us to perform apophenia on its outcome. Watching an augmented version of ourself. It currently can connect more than 23 APIs. An algorithm relates tendencies in data streams to meaningful imagery to create an aesthetic and overall image of its user. All output which is generated during the day is put into an artwork. The selfie of your data.',
  },
  {
    title: 'Out in the Open',
    type: 'entry',
    category: 'research',
    format: 'Video',
    year: '2015',
    description: 'High-frequency-trading accelerated trading of stocks far off human control. We describe it with liquidity, waves, storms, flashes and crashes. New natural forces produced by algorithms created by humans. "Out of the open" tries to relate imagery of nature to direct developments of the stock marked. It is a movie montaged by the algorithms who run the stock exchange. Movies about Nature generated by a new Natural force.',
  },
  {
    title: 'WIFIpendenceday',
    type: 'entry',
    category: 'research',
    format: 'Video',
    year: '2014',
  },
  {
    title: 'This is the Design Displacement Group',
    type: 'entry',
    category: 'research',
    format: 'Exhibition',
    year: '2014',
    institution: 'Servicegarage',
    team: 'Design Displacement Group',
  },
  {
    title: 'Edition Weissensee',
    type: 'entry',
    category: 'research',
    format: 'Print',
    year: '2020',
    institution: 'Kunsthochschule Weißensee',
    curators: 'Lisa Wilkens',
    _todo: 'Ausstellungsimpression und Scan der Arbeit',
  },
  {
    title: 'Reft to Light',
    type: 'entry',
    category: 'research',
    format: 'Performance',
    year: '2018',
    institution: 'Dialogfelder',
    collaborators: 'Daniel Schneider',
    team: 'confusion of tongues',
  },
  {
    title: 'Circular Metabolism BBQ',
    type: 'entry',
    category: 'research',
    format: 'Sculpture',
    year: '2018',
    institution: 'Dialogfelder',
    team: 'confusion of tongues',
  },
  {
    title: 'False Colours: An Image Reading',
    type: 'entry',
    category: 'research',
    format: 'Lecture',
    year: '2019',
    institution: 'Fault Lines Research Symposium, Stroom Den Haag',
    team: 'confusion of tongues',
    description: 'In a 15min talk, we ponder how and why a thermal image was made by a European border guard and argue that the operational power of the image moves guards along the lines of borders, directs EU funding into the security sector and plays part in border crime predictions.',
  },
  {
    title: 'Video Vortex',
    type: 'entry',
    category: 'research',
    format: 'Design Research',
    year: '2019',
    institution: 'Institute for Network Cultures, Malta',
  },
  {
    title: 'Diptych in Love',
    type: 'entry',
    category: 'research',
    format: 'Residency',
    year: '2020',
  },
  {
    title: 'KABK Research Group',
    type: 'entry',
    category: 'research',
    format: 'Design Research',
    year: '2019',
    institution: 'KABK & Leiden University',
  },

  // ═══════════════════════════════════════════════════════════════════
  // CLIENTS — projects (with detail page)
  // ═══════════════════════════════════════════════════════════════════
  {
    title: 'Hard Copy IV',
    type: 'project',
    template: 'project',
    category: 'clients',
    format: 'Magazine',
    year: '2019',
    institution: 'CLOSED',
    collaborators: 'Jana Neff',
    description: 'For the fourth edition of the corporate magazine of the fashion brand CLOSED we developed a magazine whose image language imitates famous paintings. The 60 pages of the magazine highlight production processes and sustainability of the brand.',
  },
  {
    title: 'Institute for Human Activities',
    type: 'project',
    template: 'project',
    category: 'clients',
    format: 'Website',
    year: '2015',
    institution: 'Renzo Martens',
    collaborators: 'Metahaven',
    description: 'The "Institute for Human Activities" is an art project by Renzo Martens. To underline the accelerationist approach of his work, a news website was created for the publication of his research that also sells products by artist friends of the IHA through a small webshop.',
    description_de: 'Das „Institut for Human Activities" ist ein Kunstprojekt von Renzo Martens. Um dem akzelerationistischen Ansatz seiner Arbeit zu unterstreichen, wurde für die Publikation seiner Untersuchungen eine News-Website erstellt, die auch über einen kleinen Webshop Produkte von befreundeten Künstlern des IHA verkauft.',
  },
  {
    title: 'Open Lobby',
    type: 'project',
    template: 'project',
    category: 'clients',
    format: 'Installation, Performance',
    year: '2014',
    institution: 'Jan van Eyck Academy Maastricht',
    collaborators: 'Elke Uitentuis, We are here',
    team: 'confusion of tongues',
    description: 'escape-tours.eu is a participatory project with refugees from "We are here" in Amsterdam. For the Open Studios at the Jan van Eyck Academy in 2014, an office was set up that allowed visitors to independently create dialogues on the refugee situation. The dialogues were based on text fragments from public statements of various personalities on different aspects of the refugee situation in the Netherlands.',
    description_de: 'escape-tours.eu ist ein partizipatives Projekt mit Geflüchteten von "We are here" aus Amsterdam. Für die Open Studios an der Jan van Eyk Akademie in 2014 wurde ein Büro eingerichtet, welches es Besuchern ermöglichte, eigenständig Dialoge zur Flüchtlingssituation zu erstellen.',
  },
  {
    title: 'KABK Graduation Festival',
    type: 'project',
    template: 'project',
    category: 'clients',
    format: 'Identity',
    year: '2014',
    institution: 'Royal Academy of the Arts Den Haag',
    collaborators: 'Gilles de Brock, Marthe Prins',
    description: 'Each printed matter of the "Graduation Festival 2014" is based on a Wordpress blog. Starting from the website of this project, posters, banners, flyers and an approx. 200-page exhibition catalog were generated, which was printed on demand on site. Students were able to update images of their final project during the festival and visitors could take away an up-to-date printed version of the catalog as a unique copy each day.',
    description_de: 'Jede Drucksache des „Graduation Festivals 2014" basiert auf einem Wordpress-Blog. Ausgehend von der Website dieses Projektes wurden Poster, Banner, Flyer und ein ca. 200-Seitiger Ausstellungskatalog generiert, welcher vor Ort on demand gedruckt wurde.',
  },
  {
    title: 'Schwules Museum',
    type: 'project',
    template: 'project',
    category: 'clients',
    format: 'Website',
    year: '2018',
    institution: 'Schwules Museum Berlin',
    collaborators: 'Goys and Birls',
    description: 'As part of the redesign of the identity of the "schwules museum" in Berlin by goys and birls we designed and developed a new website together, which also works as an archive collecting articles and past events.',
    description_de: 'Das Schwule Museum wurde 1985 gegründet und gilt als eines der größten LGBTIQ-Museen der Welt. Allein die Sammlung umfasst etwa 1,5 Millionen Archivalien.',
    _todo: 'screencapture von Website, Screenshots aufarbeiten',
  },
  {
    title: 'Studium Generale',
    type: 'project',
    template: 'project',
    category: 'clients',
    format: 'Website',
    year: '2016',
    institution: 'Royal Academy of the Arts Den Haag',
    collaborators: 'Gilles de Brock',
    description: 'The "Studium Generale" is an annual lecture program of the Royal Academy of Arts The Hague. The website works like an email inbox. Each lecture is designed like a received mail. All other announcements are spam-like jammers.',
    description_de: 'Das „Studium Generale" ist ein jährliches Vortrags-Programm der Royal Academy of Arts Den Haag. Die Website funktioniert wie ein E-Mail-Postfach. Jeder Vortrag ist wie eine eingegangene Mail gestaltet.',
  },
  {
    title: 'Sandberg Manifesto',
    type: 'project',
    template: 'project',
    category: 'clients',
    format: 'Catalogue',
    year: '2015',
    institution: 'Sandberg Instituut',
    collaborators: 'David Ortiz Juan',
    description: 'The annual report of the Sandberg Instituut presents past and future master programs. The task this year was to create a link to the new website. The website\'s "tags" were sorted alphabetically and used as an organizing element for images and intermediate pages.',
    description_de: 'Der Jahresbericht des Sandberg Instituut stellt vergangene und zukünftige Masterprogramme vor. Die Aufgabe dieses Jahr war es, eine Verbindung zu der neuen Website zu schaffen.',
  },
  {
    title: 'Sandberg Graduation Show',
    type: 'project',
    template: 'project',
    category: 'clients',
    format: 'Identity',
    year: '2014',
    institution: 'Sandberg Instituut',
    collaborators: 'David Ortiz Juan',
    description: 'To announce the Sandberg Graduation Show, we designed a crumble Map and Poster. Capable of resisting rain it was meant to be carried around during the Graduation show between the 13 spots all over Amsterdam, where the graduation show was taking place.',
  },
  {
    title: 'Drei, Drie, Three — 100 Jahre De Stijl',
    type: 'project',
    template: 'project',
    category: 'clients',
    format: 'Exhibition, Curation',
    year: '2017',
    institution: 'Botschaft der Niederlande Berlin',
    collaborators: 'Anna Bierler',
    team: 'Prof. Wim Westerveld',
    credits_image: 'Anna Bierler',
    description: 'On the occasion of the 100th anniversary of De Stijl, the Dutch Embassy in Berlin organized a celebration. The result of the workshop — 26 books — was exhibited at the Embassy of the Netherlands along with an exhibition catalog and window lettering.',
    description_de: 'Anlässlich des 100-jährigen Jubiläums von de Stijl veranstaltete die holländische Botschaft in Berlin eine Feier. Die Resultate des Workshops wurden in der Botschaft ausgestellt.',
  },

  // ═══════════════════════════════════════════════════════════════════
  // CLIENTS — entries (table row only)
  // ═══════════════════════════════════════════════════════════════════
  {
    title: 'Here to Support',
    type: 'entry',
    category: 'clients',
    format: 'Identity, Interaction Design',
    year: '2014',
    institution: 'We Are Here',
    collaborators: 'David Ortiz Juan',
    description: '"Here to Support" is the official support organization of the refugee group "We are here" in Amsterdam. The identity attracts attention also through this the deliberately designed illegibility of the logo. The motto of Captchas "are you human?" is interpreted as a statement about the equality of all people. The captcha aesthetic serves as a continuous ribbon connecting the entire identity.',
    description_de: '„Here to Support" ist die offizielle Unterstützerorganisation der Geflüchteten-Gruppe „We are here" in Amsterdam. Die Identität bricht mit Klischees klassischer humanitärer Organisationen und erregt auch dadurch Aufmerksamkeit. Den Leitsatz von Captchas „are you human?" wird als Statement zur Gleichheit aller Menschen interpretiert. Die Captcha-Ästhetik dient als durchgehendes Band für das gesamte Erscheinungsbild.',
  },
  {
    title: 'Andreas Meichsner',
    type: 'entry',
    category: 'clients',
    format: 'Website',
    year: '2019',
    role: 'UX/UI Design, Webdevelopment',
  },
  {
    title: 'Voith',
    type: 'entry',
    category: 'clients',
    format: 'Interaction Design',
    year: '2017',
    institution: 'Wir Design',
    role: 'UX/UI Design',
  },
  {
    title: 'Sandberg Announcements',
    type: 'entry',
    category: 'clients',
    format: 'Poster Design',
    year: '2014',
    institution: 'Sandberg Instituut',
    collaborators: 'David Ortiz Juan',
    description: 'For one and a half years I was in charge of the Sandberg Instituut as a designer. The tasks included the creation of all advertising materials and guidance systems for the open day, the graduate exhibition and other public events of the university.',
    description_de: 'Eineinhalb Jahre betreute ich das Sandberg Instituut als Designer. Zu den Aufgaben gehörte das Anfertigen sämtlicher Werbemittel und Leitsysteme für den Tag-der-offenen-Tür, die Absolventen-Ausstellung und andere öffentliche Events der Hochschule.',
  },
  {
    title: 'Sandberg Open Day',
    type: 'entry',
    category: 'clients',
    format: 'Identity',
    year: '2014',
    institution: 'Sandberg Instituut',
    collaborators: 'David Ortiz Juan',
  },
  {
    title: 'Expand All',
    type: 'entry',
    category: 'clients',
    format: 'Website',
    year: '2021',
    institution: 'Kunsthochschule Weißensee',
    collaborators: 'Marco Land',
  },
  {
    title: 'Tatwerk',
    type: 'entry',
    category: 'clients',
    format: 'Website',
    year: '2021',
    role: 'UX/UI Design, Webdevelopment',
  },
  {
    title: 'Amelie Losier',
    type: 'entry',
    category: 'clients',
    format: 'Website',
    year: '2022',
    role: 'UX/UI Design, Webdevelopment',
  },
  {
    title: 'Erik Andrisse',
    type: 'entry',
    category: 'clients',
    format: 'Website',
    year: '2013',
    collaborators: 'Gabriele Goetz',
    role: 'UX/UI Design, Webdevelopment',
  },
  {
    title: 'Schloss Falkenlust',
    type: 'entry',
    category: 'clients',
    format: 'Exhibition Graphics',
    year: '2021',
    role: 'Ausstellungsgrafik, Interaktion im Raum',
  },
  {
    title: 'SMAC Chemnitz Katalog',
    type: 'entry',
    category: 'clients',
    format: 'Graphic Design',
    year: '2021',
  },
  {
    title: 'Studio Achtviertel',
    type: 'entry',
    category: 'clients',
    format: 'Graphic Design, Interaction',
    year: '2021',
    institution: 'Mobiles Geschichtslabor Karlsruhe',
  },
  {
    title: 'Leiter am Waal',
    type: 'entry',
    category: 'clients',
    format: 'Website',
    year: '2017',
    role: 'UX/UI Design, Webdevelopment',
  },
  {
    title: 'Gruppe Unterberger',
    type: 'entry',
    category: 'clients',
    format: 'Website',
    year: '2017',
    role: 'UX/UI Design, Webdevelopment',
  },
  {
    title: 'Mister Spex',
    type: 'entry',
    category: 'clients',
    format: 'UX/UI Design',
    year: '2016–2017',
  },
  {
    title: 'Wir Design',
    type: 'entry',
    category: 'clients',
    format: 'UX/UI Design',
    year: '2016',
  },
  {
    title: 'Piggy Poof',
    type: 'entry',
    category: 'clients',
    format: 'Website',
    year: '2015',
    role: 'UX/UI Design, Webdevelopment',
  },
  {
    title: 'Metahaven / Renzo Martens',
    type: 'entry',
    category: 'clients',
    format: 'Website',
    year: '2015',
    role: 'UX/UI Design, Webdevelopment',
  },
  {
    title: 'Hotel Rebel',
    type: 'entry',
    category: 'clients',
    format: 'Website',
    year: '2015',
    role: 'UX/UI Design, Webdevelopment',
  },
  {
    title: 'Institut fuer Berufsintegrierende',
    type: 'entry',
    category: 'clients',
    format: 'Website',
    year: '2014',
    role: 'UX/UI Design, Webdevelopment',
  },
  {
    title: 'Dennerlein Brands',
    type: 'entry',
    category: 'clients',
    format: 'Graphic Design, Branding',
    year: '2013',
  },
  {
    title: 'Novum',
    type: 'entry',
    category: 'clients',
    format: 'Graphic Design, Branding',
    year: '2012',
  },
  {
    title: 'ISEA 2016',
    type: 'entry',
    category: 'clients',
    format: 'Design Research',
    year: '2016',
  },
  {
    title: 'Roosje Klap / Jan van Eyck Academy',
    type: 'entry',
    category: 'clients',
    format: 'Design Research',
    year: '2016',
  },

  // ═══════════════════════════════════════════════════════════════════
  // TEACHING — projects (with detail page)
  // ═══════════════════════════════════════════════════════════════════
  {
    title: 'Digital Campfire I: Digital vs. Archaic',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Workshop',
    year: '2014',
    institution: 'École supérieure d\'art de Cambrai',
    team: 'Design Displacement Group',
    description: 'The seven-day workshop with 90 undergraduate students from ESAC Cambrai focused on the transitions from analogue to digital in relation to communication. The students were divided into five groups that dealt with the transition from the archaic to the digital in the areas of belief, propaganda, cryptography, history and capital. Each group also had collective tasks to complete, such as designing an evening program, preparing a meal, and documenting work processes.',
    description_de: 'Der siebentägige Workshop mit 90 Studierenden der ESAC Cambrai beschäftigte sich mit den Verbindungen vom Analogen und Digitale Kommunikationsmitteln. Dafür wurden die Studierenden in fünf Gruppen aufgeteilt, die sich mit dem Wandel vom Archaischen ins Digitale beschäftigten.',
  },
  {
    title: 'Digital Campfire II: Universal Sign Systems',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Workshop',
    year: '2015',
    institution: 'Jan van Eyck Academy Maastricht',
    team: 'Design Displacement Group',
    description: 'The Summer School of the van Eyck Academy in Maastricht dealt with the design of universal and timeless sign systems. The participants were given the task to think about the possibilities of a warning system for a nuclear repository — a sign system that works both now and in 100,000 years. Over the seven days, the age for which the warning system should be designed became shorter and shorter until it reached zero hour on the last day. The results were documented in a publication and buried in a time capsule in the garden of the Jan van Eyck Academy.',
    description_de: 'Die Sommerschule der Jan van Eyck Academy in Maastricht beschäftigte sich mit der Gestaltung universeller und zeitloser Zeichensysteme.',
  },
  {
    title: 'Digital Campfire III',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Workshop',
    year: '2016',
    institution: 'Graphic Design Festival Glasgow',
    team: 'Design Displacement Group',
    description: 'A workshop with Design Displacement Group at Graphic Design Festival Glasgow, continuing the Digital Campfire series exploring the connections between analog and digital means of communication.',
    description_de: 'Ein Workshop mit der Design Displacement Group beim Graphic Design Festival Glasgow.',
  },
  {
    title: '3×3 — 100 Jahre De Stijl',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Workshop',
    year: '2017',
    institution: 'Kunsthochschule Weißensee, Botschaft der Niederlande Berlin',
    team: 'Prof. Wim Westerveld',
    collaborators: 'Erwin Blok',
    description: 'The starting point of the workshop was the 3rd issue of the De Stijl magazine. This was forgotten one hundred years ago and was now to be reprinted by the students. The goal was to put their own designs in relation to the designs of other workshop participants with the help of mimeographs. Censoring, interpreting, commenting by overprinting other works. Erwin Blok took care of the technical part of the workshop. He owns a collection of 500 mimeographs and brought six of them to Berlin to teach the students this printing technique. The result was 26 books which have been exhibited at the Embassy of the Netherlands.',
  },
  {
    title: 'Pictures of an Exhibition',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Exhibition, Masterclass',
    year: '2019',
    institution: 'London College of Communication',
    collaborators: 'Susann Schuppli',
    curators: 'Paul Bailey',
    team: 'confusion of tongues',
    description: 'An exhibition and masterclass co-teaching with Marthe Prins, with guest lecturer Susan Schuppli at London College of Communication. The project explored image operations and their role in contemporary visual culture.',
  },
  {
    title: 'Fachgebiets-Katalog der Kunsthochschule Weissensee',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Semester Project',
    year: '2017',
    institution: 'Kunsthochschule Weißensee',
    collaborators: 'Silvan Händler',
    team: 'Matthias Hübner, Prof. Barbara Junge, Prof. Wim Westerveld',
    description: 'The basic idea behind the catalog was to be assisted as much as possible by technology. At the center of this is the keywording of the project images by a neural network, which can be found in the index on the cover of the catalog.',
    description_de: 'Die grundsätzliche Idee zum Katalog bestand darin, sich bei der Erstellung soweit wie möglich durch Technik „assistieren" zu lassen. Im Zentrum steht dabei die Verschlagwortung der Projektbilder durch ein neuronales Netz.',
  },
  {
    title: "Don't Do It Yourself",
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: '2-Day Workshop',
    year: '2018',
    institution: 'Kunsthochschule Weißensee',
    collaborators: 'Silvan Händeler',
    description: 'In this workshop we experimented with the perceptual phenomenon that people recognize patterns in random combinations. With the help of scripts that extract content to certain tags from Instagram and Twitter, a convolute of text-image combinations was created. Six books were created out of this convolute.',
    description_de: 'In diesem Workshop wurden dem Wahrnehmungs-Phänomen, dass Menschen Muster in zufälligen Kombinationen erkennen, experimentiert. Mithilfe von Scripten die Inhalte zu bestimmten Tags aus Instagram und Twitter extrahieren wurde ein Konvolut an Text-Bild-Kombinationen geschaffen.',
  },
  {
    title: 'All Watched Over by Machines of Loving Grace',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Exhibition, Semester Project',
    year: '2019',
    institution: 'Kunsthochschule Weißensee, Rijksmuseum Amsterdam',
    team: 'Prof. Barbara Junge',
    description: 'Quantification and the algorithmic processes associated with it are the central characteristic of an increasingly technically mediated time. In this project we dealt with technologies that raise algorithmic thinking to a new level: "Artificial Intelligence". The Rijksmuseum\'s extensive digital image archive served as a starting point for us to draw parallels between historical museology and artificial intelligence.',
    description_de: 'Quantifizierung und die damit verbundenen algorithmischen Prozesse sind das zentrale Kennzeichen einer immer mehr technisch vermittelten Zeit. In unserem Projekt beschäftigen wir uns mit parallelen Entwicklungen der „(historischen) Museologie" und der „künstlichen Intelligenz".',
  },
  {
    title: 'Die unsichtbaren Staedte',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Foundation Project',
    year: '2019',
    institution: 'Kunsthochschule Weißensee',
    team: 'Prof. Barbara Junge',
    description: '"The Invisible Cities" by Italo Calvino is a mosaic of 55 portraits of cities. Based on selected cities of the book, full-spherical 360° illustrations for smartphones / tablet computers were developed, which interpret and narrate the respective city with animations, minimal interaction and sound. We worked in Unity.',
    description_de: '»Die unsichtbaren Städte« von Italo Calvino sind ein Mosaik aus 55 Stadtporträts. Anhand von ausgewählten Städten des Buches wurden vollsphärische 360° Illustrationen für Smartphones erarbeitet.',
  },
  {
    title: 'Event Horizon',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Exhibition, Semester Project',
    year: '2019',
    institution: 'Royal Academy of the Arts Den Haag',
    collaborators: 'Marthe Prins',
    description: 'Event/Horizon explores the limitless hunger for the calculation of "future" within an epoch supposedly marked by the impossibility of scientific forecasts. Taking place in Turrell\'s Celestial Vault, the sky collapses onto the earth: a negative space in which vectors lose their capacity for territorial navigation. Within this off-shore vault, students hallucinate models for investment and render scientific models into vessels for cheerful superstition.',
  },
  {
    title: 'Modern Talking',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Foundation Project',
    year: '2018',
    institution: 'Kunsthochschule Weißensee, Sandberg Instituut',
    collaborators: 'Anja Grooten',
    description: 'During the two-week course, students learned the basics of programming using the text editor Atom, implementing HTML, JS and CSS. During a five-day field trip to transmediale, students populated an Instagram account whose content was fed into a dynamic poster generator. The course concluded with a workshop supervised by Hackers & Designers.',
    description_de: 'Im Rahmen des zweiwöchigen Kurses erlernten die Studierenden mit Hilfe des Texteditors Atom die Grundlagen der Programmierung. Während einer fünftägigen Exkursion zur transmediale bespielten die Studierenden einen Instagram-Account, dessen Inhalte in einen Poster-Generator eingespeist wurden.',
  },
  {
    title: 'Orte',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Exhibition, Semester Project',
    year: '2018',
    institution: 'Kunsthochschule Weißensee',
    team: 'Prof. Barbara Junge',
    description: 'The participants of the project chose a place to make the subject of their investigation. The places could be represented in their function, in their meaning as a possibility for social processes, in their poetic and emotional dimension, in their spatial and temporal structure. Exhibited in the Kunsthaus Bethanien under the name of "Sichtweisen".',
    description_de: 'Die Teilnehmenden des Projektes wählten einen Ort, den sie zum Gegenstand ihrer Untersuchung machten. Die Orte konnten in ihrer Funktion, in ihrer Bedeutung als Möglichkeit für soziale Vorgänge, in ihrer poetischen und emotionalen Dimension dargestellt werden.',
  },
  {
    title: 'Weissensee.tv Rundgang',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Identity, Interaction Design, Semester Project',
    year: '2020',
    institution: 'Kunsthochschule Weißensee',
    team: 'Prof. Barbara Junge, Prof. Julian Adenauer',
    description: 'The semester project "weissensee.tv" from Visual Communication developed strategies to enable a tour despite Corona. Ideas were bundled into a concept for a streaming festival.',
    description_de: 'Das Semesterprojekt "weissensee.tv" aus der Visuellen Kommunikation entwickelt Strategien trotz Corona einen Rundgang zu ermöglichen.',
    _todo: 'Screencapture und Prozessbilder',
  },
  {
    title: 'Jitsi Bitsi Spider',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Lecture Series',
    year: '2020',
    institution: 'Kunsthochschule Weißensee',
    collaborators: 'Matthias Hübner',
    description: 'Jitsi Bitsi Spider was started during the first German corona lockdown as a late night lecture series. Invited is always one person who introduces the next person to be invited and so on. Dresscode is pajamas.',
    description_de: 'Jitsi Bitsi Spider wurde während dem ersten deutschen Corona Lockdown ins Leben gerufen als eine Vortragsreihe am späten Abend. Eingeladen wird immer eine Person die die nächste einzuladende Person vorstellt. Dresscode ist Schlafanzug.',
    _todo: 'videos der Plakate',
  },
  {
    title: 'Talk to Us — Corona Awareness Campaign',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Semester Project',
    year: '2020',
    institution: 'Bezirksamt Friedrichshain-Kreuzberg, Kunsthochschule Weißensee',
    team: 'Prof. Dr. Gabriele Werner',
    description: '800 posters with multilingual slogans were hung on street lamps and billboards in Friedrichshain-Kreuzberg. The campaign was developed on behalf of the district office to make young people aware of the Corona hygiene rules.',
    description_de: 'Plakate mit mehrsprachigen Sprüchen sind überall im Friedrichshain-Kreuzberger Stadtbild zu sehen. Insgesamt 800 Poster wurden nach und nach an Straßenlaternen und auf Plakatwänden aufgehängt.',
    _todo: 'Endresultate und Prozessbilder',
  },
  {
    title: 'Mehr als Rundgang',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Identity, Semester Project',
    year: '2019',
    institution: 'Kunsthochschule Weißensee',
    collaborators: 'Merle Dammhayn',
    description: 'Each medium follows a more-than-principle ("more ____ than ____"). The preceding "more" suggests self-exaggeration, but this is undermined by the actual comparison. The tone of the campaign is self-deprecating to a healthy degree.',
    description_de: 'Der Rundgang an Kunsthochschulen ist der Anlass, zu dem sich eine Institution einmal im Jahr einem breiten Publikum öffnet. Jedes Medium folgt einem mehr–als-Prinzip (» mehr ____ als ____«).',
    _todo: 'Endresultate Handybilder',
  },
  {
    title: 'Bender Gallery',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Exhibition',
    year: '2019',
    institution: 'Kunsthochschule Weißensee',
    collaborators: 'Merle Dammhayn',
    description: 'In the Weißensee School of Art there is a room exactly one square meter in size. Since 2019, this space has been a gallery that literally has no room for barriers. BENDER was brought to life to teach students the role of graphic designers as curators.',
    description_de: 'In der Kunsthochschule Weißensee findet sich ein genau ein Quadratmeter großer Raum. Seit 2019 ist dieser Raum eine Galerie die sprichwörtlich keinen Platz für Schranken bietet.',
    _todo: 'Prozessbilder',
  },
  {
    title: 'Archive for Youth Culture',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Foundation Project',
    year: '2017',
    institution: 'Kunsthochschule Weißensee',
    description: 'In eight weeks of the summer semester, we devoted ourselves to the genealogy of youth. The goal was to design a prototype of a website providing a proposal for making the content of the Archive of Youth Cultures accessible to a broad public.',
    description_de: 'In acht Wochen im Sommersemester wollen wir uns der Genealogie der Jugend widmen. Das Ziel des Kurses ist es einen Prototypen einer Webseite zu gestalten.',
  },
  {
    title: 'Radio Sowjo',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: '1-Week Workshop',
    year: '2019',
    institution: 'Kunsthochschule Weißensee',
    collaborators: 'Matthias Hübner',
    description: 'Radiosowjo is a temporary radio station that students ran for 4 days during a study trip. Every day a previously produced radio program of 6-7 broadcasts was released via radio.weissensee.blog.',
    description_de: 'Radiosowjo ist eine temporäre Radiostation, die Studierende der Visuellen Kommunikation im Rahmen einer Studienreise für 4 Tage bespielen.',
    _todo: 'Prozessbilder von Matthias? Eigenes Handy',
  },

  // ═══════════════════════════════════════════════════════════════════
  // TEACHING — graduations (project template + student)
  // ═══════════════════════════════════════════════════════════════════
  {
    title: 'Synthetische Wahrnehmungsform im Gestaltungsprozess',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Master Graduation',
    year: '2018',
    institution: 'Kunsthochschule Weißensee',
    student: 'Kathleen Raasch',
    team: 'Prof. Wim Westerveld',
    credits_image: 'Kathleen Raasch',
    description: 'Kathleen Raasch\'s project addresses the synesthetic form of perception in the design process. The visual examination illustrates the phenomenon of synesthesia and refers to the topics of information and image as well as association and intuition.',
    description_de: 'Das Projekt von Kathleen Raasch thematisiert die synästhetische Wahrnehmungsform im Gestaltungsprozess.',
  },
  {
    title: 'Wir muessen reden',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Bachelor Graduation',
    year: '2019',
    institution: 'Kunsthochschule Weißensee',
    student: 'Anna Bierler',
    team: 'Prof. Rudolf Barmettler, Prof. Wim Westerveld',
    description: 'Cooperation with the Institute of Social Work of the University of Applied Sciences St.Gallen. As part of a participatory research project on community-oriented work, a print publication and an app concept were designed.',
    description_de: 'Kooperation mit dem Institut für Soziale Arbeit der FH St.Gallen. Im Rahmen eines partizipativen Forschungsprojekts über Community-orientierte Arbeit wurde eine Print-Publikation gestaltet und eine App konzipiert.',
  },
  {
    title: 'Ein Gespenst geht um',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Bachelor Graduation',
    year: '2020',
    institution: 'Kunsthochschule Weißensee',
    student: 'Merle Dammhayn',
    team: 'Prof. Wim Westerveld',
    description: 'Sex workers are structurally marginalized almost everywhere in the world. The installation argues for the integration of the struggle for sex workers\' rights into a broader spectrum of feminist agendas.',
    description_de: 'Sexarbeitende werden fast überall auf der Welt strukturell marginalisiert. »Ein Gespenst geht um« plädiert auf die Eingliederung des Kampfes für Sexarbeiter_innenrechte in ein breiteres Spektrum feministischer Agenda.',
  },
  {
    title: 'Open the Black Box',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Master Graduation',
    year: '2020',
    institution: 'Kunsthochschule Weißensee',
    student: 'Sarah Schögler',
    team: 'Prof. Barbara Junge',
    description: '\'Open the Black Box\' confronts the question of how perceptual structures and biases of artificial intelligence can be investigated and made transparent. The results are visualized in the form of a spatial installation combining animated illustration, sculptures and visual experiments.',
    description_de: '›Open the Black Box‹ begegnet der Frage, wie Wahrnehmungsstrukturen und Vorurteile der sog. künstlichen Intelligenz untersucht und transparent gemacht werden können.',
  },
  {
    title: 'MA(CHI)NE',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Bachelor Graduation',
    year: '2020',
    institution: 'Kunsthochschule Weißensee',
    student: 'Caroline Lei',
    team: 'Prof. Barbara Junge',
    description: 'MA(CHI)NE is a multimedia spatial installation in which reflections on the influence of artificial intelligences in the future are interwoven with ancient Chinese practices. A future scenario is imagined in which artificial intelligences heal with the help of ancient Chinese medicine.',
    description_de: 'MA(CHI)NE ist eine multimediale Rauminstallation, in der Überlegungen zum Einfluss Künstlicher Intelligenzen in der Zukunft mit uralten chinesischen Praktiken verwoben werden.',
  },
  {
    title: 'Wasserstories',
    type: 'project',
    template: 'project',
    category: 'teaching',
    format: 'Master Graduation',
    year: '2019',
    institution: 'Kunsthochschule Weißensee',
    student: 'Caroline Breidenbach',
    team: 'Prof. Barbara Junge',
    description: 'The project "water stories" comprises an exhibition concept that addresses the water crisis and the closely related privatization. Through mirroring privatization stories from around the world onto German locations, absurd-realistic future scenarios are created.',
    description_de: 'Das Projekt »wasserstories« umfasst ein Ausstellungskonzept, welches die Wasserkrise und die damit eng zusammenhängende Privatisierung thematisiert.',
  },

  // ═══════════════════════════════════════════════════════════════════
  // TEACHING — entries (table row only)
  // ═══════════════════════════════════════════════════════════════════
  {
    title: 'Digital Design I',
    type: 'entry',
    category: 'teaching',
    format: 'Semester Project',
    year: '2017',
    institution: 'University of Europe',
    _todo: 'Screencaptures',
  },
  {
    title: 'Digital Design II',
    type: 'entry',
    category: 'teaching',
    format: 'Semester Project',
    year: '2018',
    institution: 'University of Europe',
    _todo: 'Screencaptures',
  },
  {
    title: 'Digital Design III',
    type: 'entry',
    category: 'teaching',
    format: 'Semester Project',
    year: '2018',
    institution: 'University of Europe',
    _todo: 'Screencaptures',
  },
  {
    title: 'XDXD — Desktopmovies',
    type: 'entry',
    category: 'teaching',
    format: '2-Day Workshop',
    year: '2019',
    institution: 'Kunsthochschule Weißensee',
  },
  {
    title: 'We vs. Virus',
    type: 'entry',
    category: 'teaching',
    format: 'Foundation Project',
    year: '2020',
    institution: 'Kunsthochschule Weißensee',
    team: 'Holger Heismeyer, Prof. Barbara Junge',
    _todo: 'Screencaptures noch nichts dokumentiert',
  },
  {
    title: 'Moving Membranes Workshop',
    type: 'entry',
    category: 'teaching',
    format: 'Workshop',
    year: '2019',
    institution: 'University of Europe',
    team: 'confusion of tongues',
  },
  {
    title: 'Images in Disguise',
    type: 'entry',
    category: 'teaching',
    format: '2-Day Workshop',
    year: '2021',
    institution: 'HTW Berlin School of Design and Culture',
  },
  {
    title: 'Weissensee Website',
    type: 'entry',
    category: 'teaching',
    format: 'Foundation Project, Semester Project',
    year: '2021',
    institution: 'Kunsthochschule Weißensee',
    team: 'Holger Heismeyer, Prof. Barbara Junge',
  },
];

// ─── Generate Files ─────────────────────────────────────────────────
let created = 0;
let skipped = 0;

for (const item of projects) {
  const slug = slugify(item.title);
  const dir = join(BASE, item.category);
  mkdirSync(dir, { recursive: true });

  // Check if file already exists (any extension)
  const mdPath = join(dir, `${slug}.md`);
  const mdxPath = join(dir, `${slug}.mdx`);
  if (existsSync(mdPath) || existsSync(mdxPath)) {
    console.log(`SKIP (exists): ${item.category}/${slug}`);
    skipped++;
    continue;
  }

  const frontmatter = buildFrontmatter(item);
  let body = '';

  // Add body content for items with descriptions
  if (item.description) {
    body = `\n${item.description}\n`;
  }

  writeFileSync(mdPath, frontmatter + '\n' + body);
  console.log(`CREATE: ${item.category}/${slug}.md (${item.type}${item.template ? '/' + item.template : ''})`);
  created++;
}

console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
