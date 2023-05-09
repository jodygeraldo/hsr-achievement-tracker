import { enums, is } from "superstruct"
import { getDbConnection } from "~/services/db.server"

type Slugify<S extends string> = S extends `${infer T} ${infer U}`
	? `${Slugify<T>}-${Slugify<U>}`
	: Lowercase<S>

type CategoryName =
	| "Trailblazer"
	| "The Rail Unto the Stars"
	| "Eager for Battle"
	| "Vestige of Luminflux"
	| "Universe in a Nutshell"
	| "Glory of the Unyielding"
	| "Moment of Joy"
	| "The Memories We Share"
	| "Fathom the Unfathomable"

type SlugifiedCategoryName = Slugify<CategoryName>

type Category = {
	name: CategoryName
	slug: SlugifiedCategoryName
	size: number
}

type Achievement = {
	name: string
	version: `${number}.${number}`
	clue?: string
	done?: boolean
}

const achievementByCategory: Record<SlugifiedCategoryName, Achievement[]> = {
	trailblazer: [
		{ name: "Ever-Burning Amber", version: "1.0" },
		{ name: "Destiny Beckons (I)", version: "1.0" },
		{ name: "Destiny Beckons (II)", version: "1.0" },
		{ name: "Destiny Beckons (III)", version: "1.0" },
		{ name: "I Have Finished The Race", version: "1.0" },
		{ name: "My Childhood", version: "1.0" },
		{ name: "Don't Make This Too Easy (I)", version: "1.0" },
		{ name: "Don't Make This Too Easy (II)", version: "1.0" },
		{ name: "Don't Make This Too Easy (III)", version: "1.0" },
		{ name: "My Apprenticeship", version: "1.0" },
		{ name: "Path Traces (I)", version: "1.0" },
		{ name: "Path Traces (II)", version: "1.0" },
		{ name: "Path Traces (III)", version: "1.0" },
		{ name: "Path Traces (IV)", version: "1.0" },
		{ name: "Sovereign Warframe", version: "1.0" },
		{ name: "There's Always Time for Love", version: "1.0" },
		{ name: "My Universities", version: "1.0" },
		{ name: "Childhood's End", version: "1.0" },
		{ name: "Divine Relics (IV)", version: "1.0" },
		{ name: "Divine Relics (V)", version: "1.0" },
		{ name: "Armed to the Teeth", version: "1.0" },
	],
	"the-rail-unto-the-stars": [
		{ name: "My Heart Lies With the Stars", version: "1.0" },
		{ name: "Everwinter Night", version: "1.0" },
		{ name: "Lost World", version: "1.0" },
		{ name: "Half the Wizard of Oz", version: "1.0" },
		{ name: "Winter Is Leaving", version: "1.0" },
		{ name: "Sauntering Fox", version: "1.0" },
		{ name: "Omniscia Spares None", version: "1.0" },
		{ name: "A Professional Onlooker", version: "1.0" },
		{ name: "Prophets Do Not Prophesize", version: "1.0" },
		{ name: "The Deer Hunter", version: "1.0" },
		{ name: 'Slayer of a Very "Deer" Friend', version: "1.0" },
		{ name: "Draconic Opulence", version: "1.0" },
	],
	"eager-for-battle": [
		{ name: "A Casualty of Armors", version: "1.0" },
		{ name: "A Song of Vice and Dire", version: "1.0" },
		{ name: "A Thousand Cuts...", version: "1.0" },
		{ name: "Accidental Amnesia", version: "1.0" },
		{ name: "Achilles' Horse", version: "1.0" },
		{ name: "Add Insult to Injury", version: "1.0" },
		{ name: "All Men Must Die", version: "1.0" },
		{ name: "Always Come Prepared", version: "1.0" },
		{ name: "Annihilation", version: "1.0" },
		{ name: "Attack! No Matter the Cost!", version: "1.0" },
		{ name: "Blade of Taixu", version: "1.0" },
		{ name: "Bring a Gun to a Knife Fight", version: "1.0" },
		{ name: "Break Till Broken", version: "1.0" },
		{ name: "Bullet Time", version: "1.0" },
		{ name: "Cataclysm Disruptor", version: "1.0" },
		{ name: "Chad Norris", version: "1.0" },
		{ name: "Code of Chivalry", version: "1.0" },
		{ name: "Coffee Lover", version: "1.0" },
		{ name: "Consecutive Normal Punches", version: "1.0" },
		{ name: "Decapitation Strike", version: "1.0" },
		{ name: "Deus Ex Machina", version: "1.0" },
		{ name: "Doldrums", version: "1.0" },
		{ name: "DoT Breaker (I)", version: "1.0" },
		{ name: "DoT Breaker (II)", version: "1.0" },
		{ name: "Earthwork", version: "1.0" },
		{ name: "Electric Dreams", version: "1.0" },
		{ name: "Energy Grandet", version: "1.0" },
		{ name: "Et tu, Bronya?", version: "1.0" },
		{ name: "Extreme Survival", version: "1.0" },
		{ name: "Fahrenheit 451", version: "1.0" },
		{ name: "Fire Breaker (I)", version: "1.0" },
		{ name: "Fire Breaker (II)", version: "1.0" },
		{ name: "Follow-Up Breaker (I)", version: "1.0" },
		{ name: "Follow-Up Breaker (II)", version: "1.0" },
		{ name: "Foolish Little Brother...", version: "1.0" },
		{ name: "Four-and-a-Half Pirouettes", version: "1.0" },
		{ name: "Friendly Fire", version: "1.0" },
		{ name: "Full Metal Jacket", version: "1.0" },
		{ name: "Heavenly Hand", version: "1.0" },
		{ name: "Highway Star", version: "1.0" },
		{ name: "Hit It Where It Hurts Most", version: "1.0" },
		{ name: "Homemade Crushed Ice", version: "1.0" },
		{ name: "Hot-Blooded", version: "1.0" },
		{ name: "I Don't Get No Respect!", version: "1.0" },
		{ name: "Ice Breaker (I)", version: "1.0" },
		{ name: "Ice Breaker (II)", version: "1.0" },
		{ name: "Imaginary Breaker (I)", version: "1.0" },
		{ name: "Imaginary Breaker (II)", version: "1.0" },
		{ name: "It's My Turn", version: "1.0" },
		{ name: "Ki Impact", version: "1.0" },
		{ name: "Lightning Breaker (I)", version: "1.0" },
		{ name: "Lightning Breaker (II)", version: "1.0" },
		{ name: "Listen...", version: "1.0" },
		{ name: "Memory, Sorrow, and Thorn", version: "1.0" },
		{ name: "Morituri Te Salutant", version: "1.0" },
		{ name: "Mozambique Drill", version: "1.0" },
		{ name: "No Offense", version: "1.0" },
		{ name: "One on One", version: "1.0" },
		{ name: "Over-Protective", version: "1.0" },
		{ name: "Passing as a Flower in the City of the Dead", version: "1.0" },
		{ name: "Perpetual Freezer", version: "1.0" },
		{ name: "Perish Song", version: "1.0" },
		{ name: "Physical Breaker (I)", version: "1.0" },
		{ name: "Physical Breaker (II)", version: "1.0" },
		{ name: "Preemptive Strike", version: "1.0" },
		{ name: "Quantum Breaker (I)", version: "1.0" },
		{ name: "Quantum Breaker (II)", version: "1.0" },
		{ name: "Regurgitation", version: "1.0" },
		{ name: "Reverberating Ruin", version: "1.0" },
		{ name: "Right-Hand Man's Many Right-Handed Right Hands", version: "1.0" },
		{ name: "Road to Canossa", version: "1.0" },
		{ name: "Save the Princess", version: "1.0" },
		{ name: "Schrödinger's Other Cat", version: "1.0" },
		{ name: "Serial Breaker", version: "1.0" },
		{ name: "Serious Punch", version: "1.0" },
		{ name: "Serval's Parting Gift", version: "1.0" },
		{ name: "Sunstorm", version: "1.0" },
		{ name: "Surge of Tiles", version: "1.0" },
		{ name: "Technique Breaker (I)", version: "1.0" },
		{ name: "Thank You for Your Service", version: "1.0" },
		{ name: "The Cold Equations", version: "1.0" },
		{ name: "The Demolished Man", version: "1.0" },
		{ name: "The Exorcist", version: "1.0" },
		{ name: "The Limping Lupine", version: "1.0" },
		{ name: "Trauma Team Platinum Bundle", version: "1.0" },
		{ name: "Trial of Thirteen", version: "1.0" },
		{ name: "Unimaginably Imaginary", version: "1.0" },
		{ name: "Unstoppable", version: "1.0" },
		{ name: "When the National Anthem Rings", version: "1.0" },
		{ name: "Will of Steel", version: "1.0" },
		{ name: "Wind Breaker (I)", version: "1.0" },
		{ name: "Wind Breaker (II)", version: "1.0" },
		{ name: "Wrathful Aurumaton", version: "1.0" },
	],
	"vestige-of-luminflux": [
		{ name: "Express Crew Roster", version: "1.0" },
		{ name: "Fate/stranger Fake", version: "1.0" },
		{ name: "The Express Passenger's Guide to the Galaxy", version: "1.0" },
		{ name: "Ripples on the Dirac Sea (I)", version: "1.0" },
		{ name: "Ripples on the Dirac Sea (II)", version: "1.0" },
		{ name: "Ripples on the Dirac Sea (III)", version: "1.0" },
		{ name: "The Great Interastral Migration", version: "1.0" },
		{ name: "Supreme Treasure of the Netherworld", version: "1.0" },
		{ name: "Interastral Peace Diamond Membership", version: "1.0" },
		{ name: "Interastral Peace Supreme Diamond Membership", version: "1.0" },
		{ name: "Mega Rich Light-Bending Guy", version: "1.0" },
	],
	"universe-in-a-nutshell": [
		{ name: "The First and Last Freedom", version: "1.0" },
		{ name: "The Art of Loving", version: "1.0" },
		{ name: "Freeze!", version: "1.0" },
		{ name: "Elemental Reaction System", version: "1.0" },
		{ name: "Your Opponent has Poor Connection", version: "1.0" },
		{ name: "Twenty Four Love Poems and a Song of Despair", version: "1.0" },
		{ name: "We Call the Heart Dancing in the Dark the Moon", version: "1.0" },
		{ name: "Good Night, My Friend", version: "1.0" },
		{ name: "Ready Player One", version: "1.0" },
		{ name: "Consumerism Psychology", version: "1.0" },
		{ name: "The Great Cosmic Gatsby", version: "1.0" },
		{ name: "A Special Experience", version: "1.0" },
		{ name: "A Not-So-Special Experience", version: "1.0" },
		{ name: "A Room of One's Own", version: "1.0" },
		{ name: "Penrose Stairs", version: "1.0" },
		{ name: "King of Infinity", version: "1.0" },
		{ name: "Fevered Strike", version: "1.0" },
		{ name: "Rosebud", version: "1.0" },
		{ name: "Adrenaline", version: "1.0" },
		{ name: "Infectious Good Luck", version: "1.0" },
		{ name: "Do Android Snails Dream of Electric Trees?", version: "1.0" },
		{ name: "Expert Tree-Climber", version: "1.0" },
		{ name: "My Swiss Army Curios", version: "1.0" },
		{ name: "Life is but a Game", version: "1.0" },
		{ name: "Who Moved My Pokeball?", version: "1.0" },
		{ name: "A Porcine Football Team", version: "1.0" },
		{ name: "Don't Let It Get Away!", version: "1.0" },
		{ name: "Existence Precedes Essence", version: "1.0" },
		{ name: "Memories Look at Me", version: "1.0" },
		{ name: "Create a Beautiful Chaos", version: "1.0" },
		{ name: "Velocity of the Universe's Expansion", version: "1.0" },
		{ name: "Wreck-It Self", version: "1.0" },
		{ name: "Gnosticism", version: "1.0" },
		{ name: "Exhalation", version: "1.0" },
		{ name: "Millenium Bug in Amber", version: "1.0" },
		{ name: "You See Memories", version: "1.0" },
		{ name: "Don't Worry Be Happy", version: "1.0" },
		{ name: "The Speed of Thought", version: "1.0" },
		{ name: "Cool Guys Don't Look At Explosions", version: "1.0" },
		{ name: "The Plague of Fantasies", version: "1.0" },
		{ name: "Angel's Breath", version: "1.0" },
		{ name: "A Finger in Every Pie", version: "1.0" },
		{ name: "An Island Unto Oneself", version: "1.0" },
		{ name: "Private Collector", version: "1.0" },
		{ name: "Triangle Strategy", version: "1.0" },
		{ name: "Master Ball", version: "1.0" },
		{ name: "A 4-Star Rarity Daydream", version: "1.0" },
		{ name: "It's Good to Be Rich!", version: "1.0" },
		{ name: "The Grand Budapest Hotel", version: "1.0" },
		{ name: "Coherence", version: "1.0" },
		{ name: "Does This Game Not Have a Platinum Trophy?", version: "1.0" },
		{ name: "Console Game", version: "1.0" },
		{ name: "If I Can Stop One Heart From Breaking", version: "1.0" },
		{ name: "Aleph is the Universe", version: "1.0" },
		{ name: "On Fire off the Shoulder of Orion", version: "1.0" },
		{ name: "Glitter at the Tannhauser Gate", version: "1.0" },
		{ name: "Lost Like Tears in Rain", version: "1.0" },
		{ name: "Wake Up!", version: "1.0" },
	],
	"glory-of-the-unyielding": [
		{ name: "Day of the Triffids (I)", version: "1.0" },
		{ name: "Day of the Triffids (II)", version: "1.0" },
		{ name: "Day of the Triffids (III)", version: "1.0" },
		{ name: "Echo of War (I)", version: "1.0" },
		{ name: "Echo of War (II)", version: "1.0" },
		{ name: "Phantom of the Cavern (I)", version: "1.0" },
		{ name: "Phantom of the Cavern (II)", version: "1.0" },
		{ name: "Phantom of the Cavern (III)", version: "1.0" },
		{ name: "Shadows Die Ad Infinitum (I)", version: "1.0" },
		{ name: "Shadows Die Ad Infinitum (II)", version: "1.0" },
		{ name: "Shadows Die Ad Infinitum (III)", version: "1.0" },
	],
	"moment-of-joy": [
		{ name: "Earth Week", version: "1.0" },
		{ name: "Earth Month", version: "1.0" },
		{ name: "Earth Year", version: "1.0" },
		{ name: "Karmic Wheel", version: "1.0" },
		{ name: "Diogenes' Utopia", version: "1.0" },
		{ name: "Insatiable", version: "1.0" },
		{ name: "Trashy Humor", version: "1.0" },
		{ name: "Saint", version: "1.0" },
		{ name: "Versatile Joker", version: "1.0" },
		{ name: "One Big Happy Family", version: "1.0" },
		{ name: "Architects (And Former Architects)", version: "1.0" },
		{ name: "It Takes Three", version: "1.0" },
		{ name: "Match-Three", version: "1.0" },
		{ name: "Lone Wolf", version: "1.0" },
		{ name: "For the Amber Lord", version: "1.0" },
		{ name: "Ablution Dictum", version: "1.0" },
		{ name: "The Xianzhou Alliance", version: "1.0" },
		{ name: "Meaningless Achievement", version: "1.0" },
		{ name: "The Great Accord", version: "1.0" },
		{ name: "Knowledge is Power", version: "1.0" },
		{ name: "Miracles of Yaoshi", version: "1.0" },
		{ name: "Tempestuous Suppression", version: "1.0" },
		{ name: "Fulguration Beckoner", version: "1.0" },
		{ name: "Total Conflagration", version: "1.0" },
		{ name: "Glacier Dynast", version: "1.0" },
		{ name: "Quantum Test", version: "1.0" },
		{ name: "Imaginary Law", version: "1.0" },
		{ name: "Speak with Fists", version: "1.0" },
		{ name: "Hot-Blooded Trailblazer", version: "1.0" },
		{ name: "Pessimistic Trailblazer", version: "1.0" },
		{ name: "Apologetic Trailblazer", version: "1.0" },
		{ name: "The Echoer", version: "1.0" },
		{ name: "Silent Trailblazer", version: "1.0" },
		{ name: "The Meaning of Choice", version: "1.0" },
	],
	"the-memories-we-share": [
		{ name: "Guess Who I Am", version: "1.0" },
		{ name: "The Sorrows of Young Arlan", version: "1.0" },
		{ name: "The Gift of the Magi", version: "1.0" },
		{ name: "The Outskirts Here Are Quiet", version: "1.0" },
		{ name: "Clara and the Sun", version: "1.0" },
		{ name: "Serval's Faithfull: An Autobiography", version: "1.0" },
		{ name: "Seventeen's Map", version: "1.0" },
		{ name: "Diamond and Rust", version: "1.0" },
		{ name: "Farewell, Comet Hunter", version: "1.0" },
		{ name: "Does She Walk Alone?", version: "1.0" },
		{ name: "Close Encounters of the Sixth Kind", version: "1.0" },
		{ name: "Disposable", version: "1.0" },
		{ name: "When Breath Becomes Air", version: "1.0" },
		{ name: "Bzzt! Clock Out!", version: "1.0" },
		{ name: "Door to A New World", version: "1.0" },
		{ name: "Just A Number", version: "1.0" },
		{ name: "No King Rules Forever", version: "1.0" },
		{ name: "Green Thumb", version: "1.0" },
		{ name: "Greed Psychology", version: "1.0" },
		{ name: "One Day More", version: "1.0" },
		{ name: "Moral Higher Ground", version: "1.0" },
		{ name: "For a Breath I Tarry", version: "1.0" },
		{ name: "The Lifecycle of Software Objects", version: "1.0" },
		{ name: "Outworlder", version: "1.0" },
		{ name: "50 Credits!?", version: "1.0" },
		{ name: "Twinkly, Winkly", version: "1.0" },
		{ name: "Sweet Pom-Pom O'Mine", version: "1.0" },
		{ name: "Hurt Locker", version: "1.0" },
		{ name: "Labor Omnia Vincit", version: "1.0" },
		{ name: "Dance Like A Butterfly, Sting Like A Bee", version: "1.0" },
		{ name: "Where It All Began", version: "1.0" },
		{ name: "Knight in Shining Armor", version: "1.0" },
		{ name: "Honest Abe", version: "1.0" },
		{ name: "The Mandela Effect", version: "1.0" },
		{ name: "Natural Immunity", version: "1.0" },
		{ name: "Lā Lá Lǎ Là Land", version: "1.0" },
		{ name: "Winter City Trap", version: "1.0" },
		{ name: "For Ages 12 and Up", version: "1.0" },
		{ name: "The Kelly Gang", version: "1.0" },
		{ name: "The Banality of Evil", version: "1.0" },
		{ name: "The Fourth Little Mole", version: "1.0" },
		{ name: "The Adventurous Moles Super Grown-Up Edition", version: "1.0" },
		{ name: "A Simple Life", version: "1.0" },
		{ name: "Carpe Diem, Festina Lente, and Tempus Fugit", version: "1.0" },
		{ name: "Tootsie", version: "1.0" },
		{ name: "Cyber Fraud", version: "1.0" },
		{ name: "A Secret Makes a Woman, Woman.", version: "1.0" },
		{ name: "Fair and Square", version: "1.0" },
		{ name: "All Is Fair in Love and War", version: "1.0" },
		{ name: "From Hero to Zero", version: "1.0" },
		{ name: "Far From the Madding Crowd", version: "1.0" },
		{ name: "Let the Wind Blow Where It May", version: "1.0" },
		{ name: "Hasta la vista, Hexanexus!", version: "1.0" },
		{ name: "Rubik's Headache", version: "1.0" },
		{ name: "The Crimes That Bind", version: "1.0" },
		{ name: "Flight Cancelled", version: "1.0" },
		{ name: "Lost and Found", version: "1.0" },
		{ name: "Leave It There", version: "1.0" },
		{ name: "Have Your Cake and Eat It", version: "1.0" },
		{
			name: "Seven Birds in the Hand Is Worth A Thousand in the Bush",
			version: "1.0",
		},
		{ name: "The Seven Errors of Cycranes: Sloth", version: "1.0" },
		{ name: "The Seven Errors of Cycranes: Lust", version: "1.0" },
		{ name: "The Seven Errors of Cycranes: Gluttony", version: "1.0" },
		{ name: "The Seven Errors of Cycranes: Greed", version: "1.0" },
		{ name: "The Seven Errors of Cycranes: Envy", version: "1.0" },
		{ name: "The Seven Errors of Cycranes: Wrath", version: "1.0" },
		{ name: "The Seven Errors of Cycranes: Pride", version: "1.0" },
	],
	"fathom-the-unfathomable": [
		{ name: "Until the Light Takes Us", version: "1.0" },
		{ name: "Unopen World", version: "1.0" },
		{ name: "Where the Celestial Path May Lead", version: "1.0" },
		{ name: "Proper Role-Playing Gamer", version: "1.0" },
		{ name: "But at What Cost?", version: "1.0" },
		{ name: "A Drop in the Bucket", version: "1.0" },
		{ name: "Destructive Impulse", version: "1.0" },
		{ name: "Free Will of Destruction", version: "1.0" },
		{ name: "Take by Surprise", version: "1.0" },
		{ name: "Can't See Behind", version: "1.0" },
		{ name: "The Tertiary Power", version: "1.0" },
		{ name: "The Tertiary Dimension", version: "1.0" },
		{ name: "Dissertation Proposal", version: "1.0" },
		{ name: "Literature Review", version: "1.0" },
		{ name: "Non-pulp Fiction", version: "1.0" },
		{ name: "Everwinter City's Resident Historian", version: "1.0" },
		{ name: "Glued to Books", version: "1.0" },
		{ name: "Learned in All Things", version: "1.0" },
		{ name: "Red-Name Alert", version: "1.0" },
		{ name: "High-Level Domination", version: "1.0" },
		{ name: "Inter-Domain Roaming", version: "1.0" },
		{ name: "You Want Me to Raid Without Achievements?", version: "1.0" },
		{ name: "Tindalos Piggy", version: "1.0" },
		{ name: "Phase ATM", version: "1.0" },
		{ name: "Unearthly Marvel", version: "1.0" },
		{ name: "The Seven-Bridges Problem", version: "1.0" },
		{ name: "The Birth of Tragedy", version: "1.0" },
		{ name: "Sisyphus of the Mines", version: "1.0" },
		{ name: "The Tale of Moles", version: "1.0" },
		{ name: "Red to Red and White to White", version: "1.0" },
		{ name: "Don't You Dare Waste It", version: "1.0" },
		{ name: "A Metaphor of Caves", version: "1.0" },
		{ name: "North by Northwest", version: "1.0" },
		{ name: "Sensory Socialization", version: "1.0" },
	],
}

const categories: Category[] = [
	{
		name: "Trailblazer",
		slug: "trailblazer",
		size: achievementByCategory["trailblazer"].length,
	},
	{
		name: "The Rail Unto the Stars",
		slug: "the-rail-unto-the-stars",
		size: achievementByCategory["the-rail-unto-the-stars"].length,
	},
	{
		name: "Eager for Battle",
		slug: "eager-for-battle",
		size: achievementByCategory["eager-for-battle"].length,
	},
	{
		name: "Vestige of Luminflux",
		slug: "vestige-of-luminflux",
		size: achievementByCategory["vestige-of-luminflux"].length,
	},
	{
		name: "Universe in a Nutshell",
		slug: "universe-in-a-nutshell",
		size: achievementByCategory["universe-in-a-nutshell"].length,
	},
	{
		name: "Glory of the Unyielding",
		slug: "glory-of-the-unyielding",
		size: achievementByCategory["glory-of-the-unyielding"].length,
	},
	{
		name: "Moment of Joy",
		slug: "moment-of-joy",
		size: achievementByCategory["moment-of-joy"].length,
	},
	{
		name: "The Memories We Share",
		slug: "the-memories-we-share",
		size: achievementByCategory["the-memories-we-share"].length,
	},
	{
		name: "Fathom the Unfathomable",
		slug: "fathom-the-unfathomable",
		size: achievementByCategory["fathom-the-unfathomable"].length,
	},
]

async function getCategories(env: Env, sessionId: string) {
	const achievementSize = getAchievementSize()
	const achievedCount = await getAchievedCount(env, sessionId)

	return {
		achievementSize,
		achievedTotal: achievedCount.total,
		categories: categories.map((category) => ({
			name: category.name,
			slug: category.slug,
			size: category.size,
			achievedCount:
				achievedCount.byCategory.find(({ slug }) => slug === category.slug)
					?.count ?? "0",
		})),
	}
}

function getAchievementSize() {
	let size = 0
	Object.values(achievementByCategory).forEach(
		(values) => (size += values.length)
	)
	return size
}

async function getAchievements(
	env: Env,
	sessionId: string,
	slug: string,
	hideComplete: boolean
) {
	if (isValidSlugifiedCategoryName(slug)) {
		const db = getDbConnection(env)
		const achieved = await db
			.selectFrom("achievement")
			.select("name")
			.where(({ and, cmpr }) =>
				and([cmpr("session_id", "=", sessionId), cmpr("category", "=", slug)])
			)
			.execute()

		const achievements = achievementByCategory[slug].map((achievement) => {
			const done = achieved.find(({ name }) => name === achievement.name)
			return {
				name: achievement.name,
				version: achievement.version,
				clue: achievement.clue,
				done: Boolean(done),
			}
		})

		const categoryName = categories.find(
			(category) => category.slug === slug
		)?.name

		return {
			categoryName,
			achievements: hideComplete
				? achievements.filter(({ done }) => !done)
				: achievements,
		}
	}
}

async function getAchievedCount(env: Env, sessionId: string) {
	const db = getDbConnection(env)
	const achievedByCategory = await db
		.selectFrom("achievement")
		.select(["category as slug", db.fn.countAll<string>().as("count")])
		.where("session_id", "=", sessionId)
		.groupBy("category")
		.execute()

	let total = 0
	achievedByCategory.forEach(({ count }) => (total += Number(count)))

	return {
		total,
		byCategory: achievedByCategory,
	}
}

async function putAchived(
	env: Env,
	sessionId: string,
	categorySlug: string,
	name: string
) {
	const db = getDbConnection(env)
	await db
		.insertInto("achievement")
		.values({
			category: categorySlug,
			session_id: sessionId,
			name,
		})
		.execute()
}

async function deleteAchived(
	env: Env,
	sessionId: string,
	categorySlug: string,
	name: string
) {
	const db = getDbConnection(env)
	await db
		.deleteFrom("achievement")
		.where(({ and, cmpr }) =>
			and([
				cmpr("session_id", "=", sessionId),
				cmpr("category", "=", categorySlug),
				cmpr("name", "=", name),
			])
		)
		.execute()
}

// function clueBuilder(
// 	clue: string,
// 	highlight?: string[],
// 	link?: { keyword: string; url: string }[]
// ) {
// 	let modifiedClue = clue
// 	if (highlight) {
// 		highlight.forEach((keyword) => {
// 			modifiedClue = modifiedClue.replace(
// 				keyword,
// 				clueModifier(keyword, "highlight")
// 			)
// 		})
// 	}

// 	if (link) {
// 		link.forEach(({ keyword, url }) => {
// 			modifiedClue = modifiedClue.replace(
// 				keyword,
// 				clueModifier(keyword, "link", url)
// 			)
// 		})
// 	}

// 	return modifiedClue
// }

// function clueModifier(keyword: string, to: "highlight" | "link", url?: string) {
// 	if (to === "highlight") {
// 		return `<span class="clue-highlight">${keyword}</span>`
// 	}

// 	return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="clue-link">${keyword}</a>`
// }

function isValidSlugifiedCategoryName(
	slug: string
): slug is SlugifiedCategoryName {
	const slugifiedCategoryName: SlugifiedCategoryName[] = [
		"trailblazer",
		"the-rail-unto-the-stars",
		"eager-for-battle",
		"vestige-of-luminflux",
		"universe-in-a-nutshell",
		"glory-of-the-unyielding",
		"moment-of-joy",
		"the-memories-we-share",
		"fathom-the-unfathomable",
	]
	if (is(slug, enums(slugifiedCategoryName))) {
		return true
	} else {
		return false
	}
}

export type { Category, CategoryName, SlugifiedCategoryName, Achievement }
export { getCategories, getAchievements, putAchived, deleteAchived }

