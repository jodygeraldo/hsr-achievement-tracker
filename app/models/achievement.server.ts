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
	clue?: string | string[]
	done?: boolean
}

// prettier-ignore
const achievementByCategory: Record<SlugifiedCategoryName, Achievement[]> = {
	trailblazer: [
		{ name: "Ever-Burning Amber", version: "1.0", clue: "Tread on the Path of Preservation" },
		{ name: "Destiny Beckons (I)", version: "1.0", clue: "Possess 1 Light Cone at Lv. 40" },
		{ name: "Destiny Beckons (II)", version: "1.0", clue: "Possess 1 Light Cone at Lv. 60" },
		{ name: "Destiny Beckons (III)", version: "1.0", clue: "Possess 1 Light Cone at Lv. 80" },
		{ name: "There's Always Time for Love", version: "1.0", clue: "Possess 4 Light Cones at Lv. 80" },
		{ name: "Don't Make This Too Easy (I)", version: "1.0", clue: "Reach Equilibrium Level 1" },
		{ name: "My Childhood", version: "1.0", clue: "Enhance 4 characters to Lv. 80" },
		{ name: "Don't Make This Too Easy (II)", version: "1.0", clue: "Reach Equilibrium Level 3" },
		{ name: "My Apprenticeship", version: "1.0", clue: "React Character Level 60 with any character" },
		{ name: "Don't Make This Too Easy (III)", version: "1.0", clue: "Reach Equilibrium Level 6" },
		{ name: "My Universities", version: "1.0", clue: "React Character Level 80 with any character" },
		{ name: "Childhood's End", version: "1.0", clue: "Enhance 4 characters to Lv. 80" },
		{ name: "Path Traces (I)", version: "1.0", clue: "Active or level up character Traces 3 time(s)" },
		{ name: "Path Traces (II)", version: "1.0", clue: "Active or level up character Traces 20 time(s)" },
		{ name: "Path Traces (III)", version: "1.0", clue: "Active or level up character Traces 50 time(s)" },
		{ name: "Path Traces (IV)", version: "1.0", clue: "Active or level up character Traces 100 time(s)" },
		{ name: "Divine Relics (IV)", version: "1.0", clue: "Level up a 4-star Relic to Max level" },
		{ name: "Divine Relics (V)", version: "1.0", clue: "Level up a 5-star Relic to Max level" },
		{ name: "Armed to the Teeth", version: "1.0", clue: "Level up 4 Relics to Lv.15" },

		// in-game position check
		{ name: "I Have Finished The Race", version: "1.0", clue: "Level up all Traces for a character to the maximum level" },
		{ name: "Sovereign Warframe", version: "1.0", clue: "Equip a character with level 15 5-star Relics in all slots" },
	],
	"the-rail-unto-the-stars": [
		{ name: "My Heart Lies With the Stars", version: "1.0", clue: "Let's go space trippin'!" },
		{ name: "Everwinter Night", version: "1.0", clue: "After the Cascading Snowstorm..." },
		{ name: "Lost World", version: "1.0", clue: "Discover the secret beneath Jarilo-VI" },
		{ name: "Half the Wizard of Oz", version: "1.0", clue: "Defeat the tin man and the little girl" },
		{ name: "Winter Is Leaving", version: "1.0", clue: "Make Belobog Great Again, Again" },
		{ name: "Sauntering Fox", version: "1.0", clue: "Diplomacy is but a trade of opinions..." },
		{ name: "Omniscia Spares None", version: "1.0", clue: "What Goes Around Comes Around" },
		{ name: "A Professional Onlooker", version: "1.0", clue: "When the Wind-Watcher Watches You..." },
		{ name: "Prophets Do Not Prophesize", version: "1.0", clue: "Witness the mystery of the Divination Commision's matrix" },
		{ name: "The Deer Hunter", version: "1.0", clue: "The Furnace Endured, the Antlers Obscured" },
		{ name: 'Slayer of a Very "Deer" Friend', version: "1.0", clue: "Try to walk on the Path of The Hunt..." },
		{ name: "Draconic Opulence", version: "1.0", clue: "Witness Dan Shu's story" },
	],
	"eager-for-battle": [
		{ name: "Unstoppable", version: "1.0" },
		{ name: "Break Till Broken", version: "1.0" },
		{ name: "Serious Punch", version: "1.0" },
		{ name: "Ki Impact", version: "1.0" },
		{ name: "Annihilation", version: "1.0" },
		{ name: "Consecutive Normal Punches", version: "1.0" },
		{ name: "Blade of Taixu", version: "1.0" },
		{ name: "Reverberating Ruin", version: "1.0" },
		{ name: "Trauma Team Platinum Bundle", version: "1.0" },
		{ name: "Earthwork", version: "1.0" },
		{ name: "A Song of Vice and Dire", version: "1.0" },
		{ name: "Memory, Sorrow, and Thorn", version: "1.0" },
		{ name: "Electric Dreams", version: "1.0" },
		{ name: "Fahrenheit 451", version: "1.0" },
		{ name: "Sunstorm", version: "1.0" },
		{ name: "The Demolished Man", version: "1.0" },
		{ name: "Lightning Breaker (I)", version: "1.0" },
		{ name: "Lightning Breaker (II)", version: "1.0" },
		{ name: "Fire Breaker (I)", version: "1.0" },
		{ name: "Fire Breaker (II)", version: "1.0" },
		{ name: "Wind Breaker (I)", version: "1.0" },
		{ name: "Wind Breaker (II)", version: "1.0" },
		{ name: "Physical Breaker (I)", version: "1.0" },
		{ name: "Physical Breaker (II)", version: "1.0" },
		{ name: "Schrödinger's Other Cat", version: "1.0" },
		{ name: "The Cold Equations", version: "1.0" },
		{ name: "Unimaginably Imaginary", version: "1.0" },
		{ name: "Quantum Breaker (I)", version: "1.0" },
		{ name: "Quantum Breaker (II)", version: "1.0" },
		{ name: "Ice Breaker (I)", version: "1.0" },
		{ name: "Ice Breaker (II)", version: "1.0" },
		{ name: "Imaginary Breaker (I)", version: "1.0" },
		{ name: "Imaginary Breaker (II)", version: "1.0" },
		{ name: "Preemptive Strike", version: "1.0" },
		{ name: "Technique Breaker (I)", version: "1.0" },
		{ name: "Mozambique Drill", version: "1.0" },
		{ name: "Follow-Up Breaker (I)", version: "1.0" },
		{ name: "Follow-Up Breaker (II)", version: "1.0" },
		{ name: "A Thousand Cuts...", version: "1.0" },
		{ name: "DoT Breaker (I)", version: "1.0" },
		{ name: "DoT Breaker (II)", version: "1.0" },
		{ name: "No Offense", version: "1.0" },
		{ name: "The Exorcist", version: "1.0" },
		{ name: "Perpetual Freezer", version: "1.0" },
		{ name: "Morituri Te Salutant", version: "1.0" },
		{ name: "One on One", version: "1.0" },
		{ name: "All Men Must Die", version: "1.0" },
		{ name: "Energy Grandet", version: "1.0" },
		{ name: "Passing as a Flower in the City of the Dead", version: "1.0" },
		{ name: "Add Insult to Injury", version: "1.0" },
		{ name: "A Casualty of Armors", version: "1.0" },
		{ name: "Serial Breaker", version: "1.0" },
		{ name: "Heavenly Hand", version: "1.0" },
		{ name: "Always Come Prepared", version: "1.0" },
		{ name: "Highway Star", version: "1.0" },
		{ name: "Extreme Survival", version: "1.0" },
		{ name: "Bullet Time", version: "1.0" },
		{ name: "Deus Ex Machina", version: "1.0", clue: "Inflict Weakness Break on enemies 3 time(s) using the Trailblazer (Destruction) in a single battle" },
		{ name: "It's My Turn", version: "1.0", clue: "Seele acts 5 time(s) in a row before the next ally unit's turn" },
		{ name: "Coffee Lover", version: "1.0" },
		{ name: "Foolish Little Brother...", version: "1.0", clue: "Use Serval to deal the final blow in a victory against boss Gepard" },
		{ name: "Listen...", version: "1.0", clue: "Use the Trailblazer to fight boss Kafka and become Dominated by her" },
		{ name: "I Don't Get No Respect!", version: "1.0", clue: "Enrage the Guardian Shadow with 4 character(s) in your team" },
		{ name: "Chad Norris", version: "1.0" },
		{ name: "Attack! No Matter the Cost!", version: "1.0" },
		{ name: "Decapitation Strike", version: "1.0" },
		{ name: "The Limping Lupine", version: "1.0" },
		{ name: "Regurgitation", version: "1.0" },
		{ name: "Hit It Where It Hurts Most", version: "1.0" },
		{ name: "Cataclysm Disruptor", version: "1.0" },
		{ name: '"Thank You for Your Service"', version: "1.0" },
		{ name: "Achilles' Horse", version: "1.0" },
		{ name: "Doldrums", version: "1.0" },
		{ name: "Code of Chivalry", version: "1.0" },
		{ name: "Full Metal Jacket", version: "1.0" },
		{ name: "Right-Hand Man's Many Right-Handed Right Hands", version: "1.0" },
		{ name: "Homemade Crushed Ice", version: "1.0" },
		{ name: "Road to Canossa", version: "1.0" },
		{ name: "Save the Princess", version: "1.0" },
		{ name: "Hot-Blooded", version: "1.0" },
		{ name: "Accidental Amnesia", version: "1.0" },
		{ name: "Friendly Fire", version: "1.0" },
		{ name: "Wrathful Aurumaton", version: "1.0" },

		// in-game position check
		{ name: "Will of Steel", version: "1.0", clue: "In a single battle against boss Kafka, dispel Dominated 3 times" },
		{ name: "Bring a Gun to a Knife Fight", version: "1.0", clue: "Deal 20000 DMG or higher to an enemy whose HP percentage is equal to or lower than 1% in a single attack" },
		{ name: "Et tu, Bronya?", version: "1.0", clue: "Use Bronya to deal the final blow in a victory against boss Cocolia" },
		{ name: "Four-and-a-Half Pirouettes", version: "1.0", clue: "Trigger Herta's talent with an ally's single attack, and have her twirl 5 time(s)" },
		{ name: "Over-Protective", version: "1.0", clue: "Win 1 battle(s) without having Gepard's Shields take any DMG" },
		{ name: "Perish Song", version: "1.0", clue: "Get knocked out together with the enemy" },
		{ name: "Serval's Parting Gift", version: "1.0", clue: "Use Serval to deal the final blow in a victory against boss Cocolia" },
		{ name: "Surge of Tiles", version: "1.0", clue: 'Qingque starts her turn in the "Hidden Hand" state for 3 turn(s) in a row' },
		{ name: "Trial of Thirteen", version: "1.0", clue: "In a single battle, make Svarog block attacks toward Clara 13 times" },
		{ name: "When the National Anthem Rings", version: "1.0", clue: 'Have ally Bronya use "The Belobog March" 1 time(s) when fighting the bosses Gepard, Cocolia, and Bronya respectively' },
	],
	"vestige-of-luminflux": [
		{ name: "The Express Passenger's Guide to the Galaxy", version: "1.0" },
		{ name: "Express Crew Roster", version: "1.0" },
		{ name: "Ripples on the Dirac Sea (I)", version: "1.0" },
		{ name: "Ripples on the Dirac Sea (II)", version: "1.0" },
		{ name: "Supreme Treasure of the Netherworld", version: "1.0" },
		{ name: "Fate/stranger Fake", version: "1.0" },

		// in-game position check
		{ name: "Ripples on the Dirac Sea (III)", version: "1.0", clue: "Obtain 40 type(s) of Light Cones" },
		{ name: "The Great Interastral Migration", version: "1.0", clue: "Obtain 50 characters" },
		{ name: "Interastral Peace Diamond Membership", version: "1.0", clue: "Obtain 1,000,000 credits in total" },
		{ name: "Interastral Peace Supreme Diamond Membership", version: "1.0", clue: "Obtain 10,000,000 credits in total", },
		{ name: "Mega Rich Light-Bending Guy", version: "1.0", clue: "Obtain 100,000,000 credits in total" },
	],
	"universe-in-a-nutshell": [
		{ name: "The First and Last Freedom", version: "1.0" },
		{ name: "The Art of Loving", version: "1.0" },
		{ name: "Freeze!", version: "1.0" },
		{ name: "Elemental Reaction System", version: "1.0" },
		{ name: "Your Opponent Has Poor Connection", version: "1.0" },
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
		{ name: "Life Is but a Game", version: "1.0" },
		{ name: "Who Moved My Pokeball?", version: "1.0" },
		{ name: "A Porcine Football Team", version: "1.0" },
		{ name: "Don't Let It Get Away!", version: "1.0", clue: "Let Trotters escape 1 times in Simulated Universe" },
		{ name: "Existence Precedes Essence", version: "1.0" },
		{ name: "Memories Look at Me", version: "1.0" },
		{ name: "Create A Beautiful Chaos", version: "1.0" },
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

		// in-game position check
		{ name: "Console Game", version: "1.0", clue: "Clear Simulated Universe at difficulty 2 or higher without using the Downloader" },
		{ name: "If I Can Stop One Heart From Breaking", version: "1.0", clue: "Clear Simulated Universe at difficulty 2 or higher without breaking any destructible objects" },
		{ name: "Aleph is the Universe", version: "1.0", clue: "Clear Simulated Universe at difficulty 2 or higher with only 1 character in the team" },
		{ name: "On Fire off the Shoulder of Orion", version: "1.0", clue: "Lose against Elite enemies in Simulated Universe" },
		{ name: "Glitter at the Tannhauser Gate", version: "1.0", clue: "Lose against the Boss enemies in Simulated Universe" },
		{ name: "Lost Like Tears in Rain", version: "1.0", clue: "Lose the battle in the tavern event in Simulated Universe" },
		{ name: "Wake Up!", version: "1.0", clue: "Lose the battle in the Nildis event in Simulated Universe" },
	],
	"glory-of-the-unyielding": [
		{ name: "Shadows Die Ad Infinitum (I)", version: "1.0" },
		{ name: "Shadows Die Ad Infinitum (II)", version: "1.0" },
		{ name: "Shadows Die Ad Infinitum (III)", version: "1.0" },
		{ name: "Day of the Triffids (I)", version: "1.0" },
		{ name: "Day of the Triffids (II)", version: "1.0" },
		{ name: "Day of the Triffids (III)", version: "1.0" },
		{ name: "Phantom of the Cavern (I)", version: "1.0" },
		{ name: "Phantom of the Cavern (II)", version: "1.0" },
		{ name: "Phantom of the Cavern (III)", version: "1.0" },
		{ name: "Echo of War (I)", version: "1.0" },
		{ name: "Echo of War (II)", version: "1.0" },
	],
	"moment-of-joy": [
		{ name: "Earth Week", version: "1.0" },
		{ name: "Earth Month", version: "1.0" },
		{ name: "Diogenes' Utopia", version: "1.0" },
		{ name: "Insatiable", version: "1.0" },
		{ name: "Trashy Humor", version: "1.0" },
		{ name: "Karmic Wheel", version: "1.0" },
		{ name: "Saint", version: "1.0" },
		{ name: "It Takes Three", version: "1.0" },
		{ name: "Match-Three", version: "1.0" },

		// in-game position check
		{ name: "Earth Year", version: "1.0", clue: "Log in for a total of 365 days" },
		{ name: "Versatile Joker", version: "1.0", clue: "Use a total of 20 character(s) to form a team with Sampo and win at least 1 battle" },
		{ name: "One Big Happy Family", version: "1.0", clue: "Win 1 battle(s) with a team comprising Himeko, Welt, Dan Heng, and March 7th" },
		{ name: "Architects (And Former Architects)", version: "1.0", clue: "Win 1 battle(s) with a team comprising Bronya, Gepard, Pela, and Serval" },
		{ name: "Lone Wolf", version: "1.0", clue: "Win 10 battles with only one character on the team" },
		{ name: "For the Amber Lord", version: "1.0", clue: "Win 10 battles with a team that has 4 characters following the Path of Preservation." },
		{ name: "Ablution Dictum", version: "1.0", clue: "Win 10 battles with a team that has 4 characters following the Path of Destruction." },
		{ name: "The Xianzhou Alliance", version: "1.0", clue: "Win 10 battles with a team that has 4 characters following the Path of The Hunt." },
		{ name: "Meaningless Achievement", version: "1.0", clue: "Win 10 battles with a team that has 4 characters following the Path of Nihility." },
		{ name: "The Great Accord", version: "1.0", clue: "Win 10 battles with a team that has 4 characters following the Path of Harmony." },
		{ name: "Knowledge is Power", version: "1.0", clue: "Win 10 battles with a team that has 4 characters following the Path of Erudition." },
		{ name: "Miracles of Yaoshi", version: "1.0", clue: "Win 10 battles with a team that has 4 characters following the Path of Abundance." },
		{ name: "Tempestuous Suppression", version: "1.0", clue: "Win 10 battles with a team that has 4 Wind-Type characters." },
		{ name: "Fulguration Beckoner", version: "1.0", clue: "Win 10 battles with a team that has 4 Lightning-Type characters." },
		{ name: "Total Conflagration", version: "1.0", clue: "Win 10 battles with a team that has 4 Fire-Type characters." },
		{ name: "Glacier Dynast", version: "1.0", clue: "Win 10 battles with a team that has 4 Ice-Type characters." },
		{ name: "Quantum Test", version: "1.0", clue: "Win 10 battles with a team that has 4 Quantum-Type characters." },
		{ name: "Imaginary Law", version: "1.0", clue: "Win 10 battles with a team that has 4 Imaginary-Type characters." },
		{ name: "Speak with Fists", version: "1.0", clue: "Win 10 battles with a team that has 4 Physical-Type characters." },
		{ name: "Hot-Blooded Trailblazer", version: "1.0", clue: "Choose hot-blooded dialogue options 5 time(s)" },
		{ name: "Pessimistic Trailblazer", version: "1.0", clue: "Choose pessimistic dialogue options 5 time(s)" },
		{ name: "Apologetic Trailblazer", version: "1.0", clue: "Choose apologetic dialogue options 5 time(s)" },
		{ name: "The Echoer", version: "1.0", clue: "Choose repetitive dialogue options 3 time(s)" },
		{ name: "Silent Trailblazer", version: "1.0", clue: "Choose silent dialogue options 5 time(s)" },
		{ name: "The Meaning of Choice", version: "1.0", clue: "Choose gender-specific dialogue options 3 time(s)" },
	],
	"the-memories-we-share": [
		{ name: "Guess Who I Am", version: "1.0" },
		{ name: "The Sorrows of Young Arlan", version: "1.0" },
		{ name: "The Gift of the Magi", version: "1.0" },
		{ name: "The Outskirts Here Are Quiet", version: "1.0" },
		{ name: "Clara and the Sun", version: "1.0" },
		{ name: "Serval's Faithfull: An Autobiography", version: "1.0" },

		// in-game position check
		{ name: "Seventeen's Map", version: "1.0", clue: 'Find all readable items regarding Asta in the mission "Emptiness of Locus Silentii"' },
		{ name: "Diamond and Rust", version: "1.0", clue: 'Give the log to Bernard in the mission, "To: The Faint Star"' },
		{ name: "Farewell, Comet Hunter", version: "1.0", clue: 'Collect three "Letters From the Comet Hunter" in the mission "Out of Reach"' },
		{ name: "Does She Walk Alone?", version: "1.0", clue: `Complete the mission "Guide Paradox" and witness the android's ending` },
		{ name: "Close Encounters of the Sixth Kind", version: "1.0", clue: 'Obtain the ability to communicate with Wubbabboos in the mission "Requiem Mass"' },
		{ name: "Disposable", version: "1.0", clue: "Find and talk to all Herta puppets in the space station" },
		{ name: "When Breath Becomes Air", version: "1.0", clue: "Visit the researcher Eikura Shuu's memorial" },
		{ name: "Bzzt! Clock Out!", version: "1.0", clue: "Turn off the little robots in the space station 6 times" },
		{ name: "Door to A New World", version: "1.0", clue: 'Use the Curio "Door to A New World"' },
		{ name: "Just A Number", version: "1.0", clue: 'Use the Curio "Rating Pistol"' },
		{ name: "No King Rules Forever", version: "1.0", clue: 'Use the Curio "Unbearable Weight" and decipher the contents of the mysterious sound' },
		{ name: "Green Thumb", version: "1.0", clue: "Talk with the strange plant and visit it again on the next day" },
		{ name: "Greed Psychology", version: "1.0", clue: 'Obtain the real treasure in the mission "Survival Wisdom"' },
		{ name: "One Day More", version: "1.0", clue: `Find all of Julian's items in the mission "Hook's Treasure"` },
		{ name: "Moral Higher Ground", version: "1.0", clue: "Confront the Public Property Protector and show him the cost of stopping you (or have him humbly acknowledge his wrongdoing.)" },
		{ name: "Outworlder", version: "1.0", clue: "Return the music box found in Rivet Town to its heartbroken owner" },
		{ 
			name: "For a Breath I Tarry |DIVIDER| The Lifecycle of Software Objects", 
			version: "1.0", 
			clue: [
				'Choose to format Little Robot in the mission "Rarely Affectionate (Part 2)"',
				'Choose not to format Little Robot in the mission "Rarely Affectionate (Part 2)"',
			],
		},
		{ name: "50 Credits!?", version: "1.0", clue: "Collect all wanted posters of the Express Crew in Belobog" },
		{ name: "Twinkly, Winkly", version: "1.0", clue: "Obtain 3 Ancient Coin(s)" },
		{ name: "Sweet Pom-Pom O'Mine", version: "1.0", clue: "Try to give the Jarilo-VI's armillary sphere a spin to find... um... Pom-Pom on it?" },
		{ name: "Hurt Locker", version: "1.0", clue: "Solve the crisis at the Belobog cable car station while also avoiding ethical risks" },
		{ name: "Labor Omnia Vincit", version: "1.0", clue: "Examine file cabinets in the Seat of Divine Foresight 7 time(s)" },
		{ name: "Dance Like A Butterfly, Sting Like A Bee", version: "1.0", clue: "Dominate all 5 tournaments in the Boulder Town Super League" },
		{ name: "Where It All Began", version: "1.0", clue: "Return to the room where the Stellaron was kept and recall a blurred memory" },
		{ name: "Knight in Shining Armor", version: "1.0", clue: "Find the language model and give it to Fidora the amateur mechanic" },
		{ name: "Honest Abe", version: "1.0", clue: "Pass the test of integrity set up by a mysterious researcher" },
		{ name: "The Mandela Effect", version: "1.0", clue: `Contact Belobog's "back alley"` },
		{ name: "Natural Immunity", version: "1.0", clue: "Obtain the recipe for fried rice from talking with Gertie at the Goethe Grand Hotel" },
		{ name: "Lā Lá Lǎ Là Land", version: "1.0", clue: "Obtain the score for the phonograph from talking with Tamila at the Golden Theater" },
		{ name: "Winter City Trap", version: "1.0", clue: "Finish listening to the vagrant's rap" },
		{ name: "For Ages 12 and Up", version: "1.0", clue: "Participate in the Dark Fist Tournament and become the ultimate winner" },
		{ name: "The Kelly Gang", version: "1.0", clue: "Excavate the treasure hidden in the Belobog Administrative District's fountain" },
		{ name: "The Banality of Evil", version: "1.0", clue: `Finish all the Fool's Box puzzles in the mission "Vessel of Mediocrity"` },
		{ name: "The Fourth Little Mole", version: "1.0", clue: 'Find all the hidden treasure in the Mission "The Adventurous Moles"' },
		{ name: "The Adventurous Moles Super Grown-Up Edition", version: "1.0", clue: "Buy The Adventurous Moles: Hidden Treasure from the Belobog Book Merchant" },
		{ name: "A Simple Life", version: "1.0", clue: 'Receive a text from Luhui after completing the mission "Fired"' },
		{ name: "Carpe Diem, Festina Lente, and Tempus Fugit", version: "1.0", clue: `Receive all the texts about Chengjie's fasding passion after completing the mission "A Teacher and a Friend".` },
		{ 
			name: "Tootsie |DIVIDER| Cyber Fraud |DIVIDER| A Secret Makes a Woman, Woman.", 
			version: "1.0", 
			clue: [
				'Choose to have the Foxian Beauty reveal their true identity during the mission "From Xianzhou With Love"',
				'Choose to have the Foxian Beauty turn themselves in during the mission "From Xianzhou With Love"',
				'Choose to let the Foxian Beauty continue the ruse during the mission "From Xianzhou With Love"',
			],
		},
		{ name: "The Seven Errors of Cycranes: Sloth", version: "1.0", clue: "Convince the depressed cycrane to return to its job" },
		{ name: "Seven Birds in the Hand Is Worth A Thousand in the Bush", version: "1.0", clue: "Help Heron Express to recover all lost cycranes" },
		{ 
			name: "Fair and Square |DIVIDER| All Is Fair in Love and War |DIVIDER| From Hero to Zero", 
			version: "1.0", 
			clue: [
				"Win the Xianzhou Luofu Competitive Eater Championship openly and fairly",
				"Win the Xianzhou Luofu Competitive Eater Championship in underhanded ways",
				"Lose the Xianzhou Luofu Competitive Eater Championship",
			],
		},
		{ 
			name: "Far From the Madding Crowd |DIVIDER| Let the Wind Blow Where It May", 
			version: "1.0", 
			clue: [
				"Talk with the Immortal in a Vase and obtain its gift from the vase",
				"Talk with the Immortal in a Vase and refuse its gift",
			],
		},
		{ name: "Hasta la vista, Hexanexus!", version: "1.0", clue: "Complete 15 Hexanexus challenge(s) from the Hex Club" },
		{ name: "Rubik's Headache", version: "1.0", clue: "Complete 15 new Hexanexus challenge(s) from the Hex Club" },
		{ 
			name: "The Crimes That Bind |DIVIDER| Flight Cancelled", 
			version: "1.0", 
			clue: [
				"Stop the strange tourist from throwing a coin into the starskiff engine",
				"Help the strange tourist to throw a coin into the starskiff engine",
			],
		},
		{ 
			name: "Lost and Found |DIVIDER| Leave It There |DIVIDER| Have Your Cake and Eat It", 
			version: "1.0", 
			clue: [
				"Retrieved the credits that the fraudster took",
				"Did not retrieve the credits that the fraudster took",
				"Retrieved more credits from the fraudster than what they took",
			],
		},
		{ name: "The Seven Errors of Cycranes: Lust", version: "1.0", clue: "Follow the gentlemanly cycrane to find the picture book withheld by customs" },
		{ name: "The Seven Errors of Cycranes: Gluttony", version: "1.0", clue: "Complete a bet with the dissatisfied cycrane" },
		{ name: "The Seven Errors of Cycranes: Greed", version: "1.0", clue: 'Explore the "mountain of deliveries" protected by the "evil dragon"' },
		{ name: "The Seven Errors of Cycranes: Envy", version: "1.0", clue: "Complete the challenge from the resentful cycrane" },
		{ name: "The Seven Errors of Cycranes: Wrath", version: "1.0", clue: "Defeat the highwaymen with the brave cycrane" },
		{ name: "The Seven Errors of Cycranes: Pride", version: "1.0", clue: 'Complete the challenge from the "Four Great Villains of the Luofu (Self-Proclaimed)"' },
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
		{ name: "Can't See Behind", version: "1.0", clue: "Ambushed during exploration" },
		{ name: "The Tertiary Power", version: "1.0" },
		{ name: "The Tertiary Dimension", version: "1.0" },
		{ name: "Dissertation Proposal", version: "1.0" },
		{ name: "Literature Review", version: "1.0" },
		{ name: "Non-pulp Fiction", version: "1.0" },
		{ name: "Everwinter City's Resident Historian", version: "1.0" },
		{ name: "Glued to Books", version: "1.0" },
		{ name: "Learned in All Things", version: "1.0" }, // in-game position check
		{ name: "Red-Name Alert", version: "1.0" },
		{ name: "High-Level Domination", version: "1.0" },
		{ name: "Inter-Domain Roaming", version: "1.0" },
		{ name: "You Want Me to Raid Without Achievements?", version: "1.0" },
		{ name: "Tindalos Piggy", version: "1.0" },
		{ name: "Phase ATM", version: "1.0" },
		{ name: "Sensory Socialization", version: "1.0", clue: "Collect all Memory Bubbles scattered on the Herta Space Station" },
		{ name: "Unearthly Marvel", version: "1.0" },
		{ name: "The Seven-Bridges Problem", version: "1.0" },
		{ name: "The Birth of Tragedy", version: "1.0" },
		{ name: "Sisyphus of the Mines", version: "1.0" },
		{ name: "The Tale of Moles", version: "1.0" },
		{ name: "Red to Red and White to White", version: "1.0" },
		{ name: "Don't You Dare Waste It", version: "1.0" },
		{ name: "A Metaphor of Caves", version: "1.0" },
		{ name: "North by Northwest", version: "1.0" },
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

