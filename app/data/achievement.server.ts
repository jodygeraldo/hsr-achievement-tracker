import { clueBuilder } from "~/utils/achievement.server"

const metadata: Metadata = {
	currentVersion: "1.1",
	size: {
		"1.0": 332,
		"1.1": 15,
	},
}

/**
 * There could be mistakes or things missing in the list of achievements.
 * The order of achievements might change as I unlock more or confirm them with others.
 * There might also be some secret achievements that are not included or might not be described accurately.
 *
 * Resources:
 * - [HSR Achievement Tracker by Meow of MeowDB.com]{@link https://docs.google.com/spreadsheets/d/1zewLHLp-WnpTnIT4TdbSoUvnCtAOq0_p__ZyFsJZAEg/edit#gid=633819019}
 * - [HSR Fnadom Wiki]{@link https://honkai-star-rail.fandom.com/wiki/Achievement}
 */
const achievementByCategory: Record<SlugifiedCategoryName, Achievement[]> = {
	trailblazer: [
		{
			name: "Ever-Burning Amber",
			version: "1.0",
			isSecret: true,
			clue: "Tread on the Path of Preservation",
		},
		{
			name: "Destiny Beckons (I)",
			version: "1.0",
			clue: "Possess 1 Light Cone at Lv. 40",
		},
		{
			name: "Destiny Beckons (II)",
			version: "1.0",
			clue: "Possess 1 Light Cone at Lv. 60",
		},
		{
			name: "Destiny Beckons (III)",
			version: "1.0",
			clue: "Possess 1 Light Cone at Lv. 80",
		},
		{
			name: "There's Always Time for Love",
			version: "1.0",
			clue: "Possess 4 Light Cones at Lv. 80",
		},
		{
			name: "Don't Make This Too Easy (I)",
			version: "1.0",
			clue: "Reach Equilibrium Level 1",
		},
		{
			name: "My Childhood",
			version: "1.0",
			clue: "Reach Character Level 40 with any character",
		},
		{
			name: "Don't Make This Too Easy (II)",
			version: "1.0",
			clue: "Reach Equilibrium Level 3",
		},
		{
			name: "My Apprenticeship",
			version: "1.0",
			clue: "Reach Character Level 60 with any character",
		},
		{
			name: "Don't Make This Too Easy (III)",
			version: "1.0",
			clue: "Reach Equilibrium Level 6",
		},
		{
			name: "My Universities",
			version: "1.0",
			clue: "Reach Character Level 80 with any character",
		},
		{
			name: "Childhood's End",
			version: "1.0",
			clue: "Enhance 4 characters to Lv. 80",
		},
		{
			name: "Path Traces (I)",
			version: "1.0",
			clue: "Activate or level up character Traces 3 time(s)",
		},
		{
			name: "Path Traces (II)",
			version: "1.0",
			clue: "Activate or level up character Traces 20 time(s)",
		},
		{
			name: "Path Traces (III)",
			version: "1.0",
			clue: "Activate or level up character Traces 50 time(s)",
		},
		{
			name: "Path Traces (IV)",
			version: "1.0",
			clue: "Activate or level up character Traces 100 time(s)",
		},
		{
			name: "Divine Relics (IV)",
			version: "1.0",
			clue: "Level up a 4-star Relic to Max level",
		},
		{
			name: "Divine Relics (V)",
			version: "1.0",
			clue: "Level up a 5-star Relic to Max level",
		},
		{
			name: "Armed to the Teeth",
			version: "1.0",
			clue: "Level up 4 Relics to Lv.15",
		},

		// in-game position check
		{
			name: "I Have Finished The Race",
			version: "1.0",
			isSecret: true,
			clue: "Level up all Traces for a character to the maximum level",
		},
		{
			name: "Sovereign Warframe",
			version: "1.0",
			isSecret: true,
			clue: "Equip a character with level 15 5-star Relics in all slots",
		},
	],
	"the-rail-unto-the-stars": [
		{
			name: "My Heart Lies With the Stars",
			version: "1.0",
			clue: "Let's go space trippin'!",
		},
		{
			name: "Everwinter Night",
			version: "1.0",
			clue: "After the Cascading Snowstorm...",
		},
		{
			name: "Lost World",
			version: "1.0",
			clue: "Discover the secret beneath Jarilo-VI",
		},
		{
			name: "Half the Wizard of Oz",
			version: "1.0",
			clue: "Defeat the tin man and the little girl",
		},
		{
			name: "Winter Is Leaving",
			version: "1.0",
			clue: "Make Belobog Great Again, Again",
		},
		{
			name: "Sauntering Fox",
			version: "1.0",
			clue: "Diplomacy is but a trade of opinions...",
		},
		{
			name: "Omniscia Spares None",
			version: "1.0",
			clue: "What Goes Around Comes Around",
		},
		{
			name: "A Professional Onlooker",
			version: "1.0",
			clue: "When the Wind-Watcher Watches You...",
		},
		{
			name: "Prophets Do Not Prophesize",
			version: "1.0",
			clue: "Witness the mystery of the Divination Commission's matrix",
		},
		{
			name: "The Deer Hunter",
			version: "1.0",
			clue: "The Furnace Endured, the Antlers Obscured",
		},
		{
			name: 'Slayer of a Very "Deer" Friend',
			version: "1.0",
			clue: "Try to walk on the Path of The Hunt...",
		},
		{
			name: "Draconic Opulence",
			version: "1.0",
			clue: "Witness Dan Shu's story",
		},
	],
	"eager-for-battle": [
		{
			name: "Unstoppable",
			version: "1.0",
			clue: "Use 4 Ultimates in a row",
		},
		{
			name: "Break Till Broken",
			version: "1.0",
			clue: "Inflict Weakness Break 4 time(s) upon the same enemy in a single battle",
		},
		{
			name: "Serious Punch",
			version: "1.0",
			clue: "Deal equal to or more than 1,000 DMG in a single attack",
		},
		{
			name: "Ki Impact",
			version: "1.0",
			clue: "Deal equal to or more than 20,000 DMG in a single attack",
		},
		{
			name: "Annihilation",
			version: "1.0",
			clue: "Deal equal to or more than 150,000 DMG in a single attack",
		},
		{
			name: "Consecutive Normal Punches",
			version: "1.0",
			clue: "Deal 2,000 DMG in one attack",
		},
		{
			name: "Blade of Taixu",
			version: "1.0",
			clue: "Deal 40,000 DMG in one attack",
		},
		{
			name: "Reverberating Ruin",
			version: "1.0",
			clue: "Deal 300,000 DMG in one attack",
		},
		{
			name: "Trauma Team Platinum Bundle",
			version: "1.0",
			clue: "An ally heals for more than 8,000 HP in a single heal",
		},
		{
			name: "Earthwork",
			version: "1.0",
			clue: "An ally has a combined Shield effect greater than 5,000 at any time",
		},
		{
			name: "A Song of Vice and Dire",
			version: "1.0",
			clue: "Inflict both Burn and Freeze upon 1 enemy at the same time",
		},
		{
			name: "Memory, Sorrow, and Thorn",
			version: "1.0",
			clue: "Inflict 4 DoT effects upon 1 enemie(s) at the same time",
		},
		{
			name: "Electric Dreams",
			version: "1.0",
			clue: "Defeat 3 enemies with Lightning Break DMG in a single battle",
		},
		{
			name: "Fahrenheit 451",
			version: "1.0",
			clue: "Defeat 3 enemies with Fire Break DMG in a single battle",
		},
		{
			name: "Sunstorm",
			version: "1.0",
			clue: "Defeat 3 enemies with Wind Break DMG in a single battle",
		},
		{
			name: "The Demolished Man",
			version: "1.0",
			clue: "Defeat 3 enemies with Physical Break DMG in a single battle",
		},
		{
			name: "Lightning Breaker (I)",
			version: "1.0",
			clue: "Defeat 20 enemies with Lightning Break DMG",
		},
		{
			name: "Lightning Breaker (II)",
			version: "1.0",
			clue: "Defeat 60 enemies with Lightning Break DMG",
		},
		{
			name: "Fire Breaker (I)",
			version: "1.0",
			clue: "Defeat 20 enemies with Fire Break DMG",
		},
		{
			name: "Fire Breaker (II)",
			version: "1.0",
			clue: "Defeat 60 enemies with Fire Break DMG",
		},
		{
			name: "Wind Breaker (I)",
			version: "1.0",
			clue: "Defeat 20 enemies with Wind Break DMG",
		},
		{
			name: "Wind Breaker (II)",
			version: "1.0",
			clue: "Defeat 60 enemies with Wind Break DMG",
		},
		{
			name: "Physical Breaker (I)",
			version: "1.0",
			clue: "Defeat 20 enemies with Physical Break DMG",
		},
		{
			name: "Physical Breaker (II)",
			version: "1.0",
			clue: "Defeat 60 enemies with Physical Break DMG",
		},
		{
			name: "Schrödinger's Other Cat",
			version: "1.0",
			clue: "Inflict 5 Quantum Weakness Breaks in a single battle",
		},
		{
			name: "The Cold Equations",
			version: "1.0",
			clue: "Inflict 5 Ice Weakness Breaks in a single battle",
		},
		{
			name: "Unimaginably Imaginary",
			version: "1.0",
			clue: "Inflict 5 Imaginary Weakness Breaks in a single battle",
		},
		{
			name: "Quantum Breaker (I)",
			version: "1.0",
			clue: "Inflict Quantum Weakness Break 100 time(s)",
		},
		{
			name: "Quantum Breaker (II)",
			version: "1.0",
			clue: "Inflict Quantum Weakness Break 300 time(s)",
		},
		{
			name: "Ice Breaker (I)",
			version: "1.0",
			clue: "Inflict Ice Weakness Break 100 time(s)",
		},
		{
			name: "Ice Breaker (II)",
			version: "1.0",
			clue: "Inflict Ice Weakness Break 300 time(s)",
		},
		{
			name: "Imaginary Breaker (I)",
			version: "1.0",
			clue: "Inflict Imaginary Weakness Break 100 time(s)",
		},
		{
			name: "Imaginary Breaker (II)",
			version: "1.0",
			clue: "Inflict Imaginary Weakness Break 300 time(s)",
		},
		{
			name: "Preemptive Strike",
			version: "1.0",
			clue: "Defeat 1 enemy with Technique DMG",
		},
		{
			name: "Technique Breaker (I)",
			version: "1.0",
			clue: "Defeat 10 enemies with Technique DMG",
		},
		{
			name: "Mozambique Drill",
			version: "1.0",
			clue: "Defeat 3 enemies with follow-up attacks in a single battle",
		},
		{
			name: "Follow-Up Breaker (I)",
			version: "1.0",
			clue: "Defeat 80 enemies with follow-up attacks",
		},
		{
			name: "Follow-Up Breaker (II)",
			version: "1.0",
			clue: "Defeat 240 enemies with follow-up attacks",
		},
		{
			name: "A Thousand Cuts...",
			version: "1.0",
			clue: "Defeat 3 enemies using DoT in a single battle",
		},
		{
			name: "DoT Breaker (I)",
			version: "1.0",
			clue: "Defeat 80 enemies with DoT attacks",
		},
		{
			name: "DoT Breaker (II)",
			version: "1.0",
			clue: "Defeat 240 enemies with DoT attacks",
		},
		{
			name: "No Offense",
			version: "1.0",
			clue: "Remove buffs on enemies 5 time(s) in a single battle",
		},
		{
			name: "The Exorcist",
			version: "1.0",
			clue: "Remove debuffs from allies 5 time(s) in a single battle",
		},
		{
			name: "Perpetual Freezer",
			version: "1.0",
			clue: "Freeze 1 enemies for 3 turns in a row",
		}, // (in-game typo) enemies => enemy
		{
			name: "Morituri Te Salutant",
			version: "1.0",
			clue: "Defeat an enemy when a character has less than 1% of HP left",
		},
		{
			name: "One on One",
			version: "1.0",
			clue: "Enter combat with 4 character(s) but win with only 1 character(s) still standing",
		},
		{
			name: "All Men Must Die",
			version: "1.0",
			clue: "Receive a killing blow from enemies when at 100% HP",
		},
		{
			name: "Energy Grandet",
			version: "1.0",
			clue: "Have a character whose Energy is at 100% at the beginning of a turn for 4 turns in a row",
		},
		{
			name: "Passing as a Flower in the City of the Dead",
			version: "1.0",
			clue: "Revive 2 downed character(s) in a single battle",
		},
		{
			name: "Add Insult to Injury",
			version: "1.0",
			clue: "Deal a total of 20,000 DMG to enemies inflicted with Weakness Break in a single battle",
		},
		{
			name: "A Casualty of Armors",
			version: "1.0",
			clue: "Receive a total of 10,000 DMG on 1 character in a single battle",
		},
		{
			name: "Serial Breaker",
			version: "1.0",
			clue: "Inflict Weakness Break to 4 enemies in a single action",
		},
		{
			name: "Heavenly Hand",
			version: "1.0",
			clue: "Use a Technique to defeat all enemies upon entering battle",
		},
		{
			name: "Always Come Prepared",
			version: "1.0",
			clue: "A character has 5 or more buffs at the beginning of a turn",
		},
		{
			name: "Highway Star",
			version: "1.0",
			clue: "Allies act for 100 times in a single battle",
		},
		{
			name: "Extreme Survival",
			version: "1.0",
			clue: "Win a battle with all four allies having HP percentages equal to or less than 5%",
		},
		{
			name: "Bullet Time",
			version: "1.0",
			clue: "Allies have 10 turns of action unbroken by enemies",
		},
		{
			name: "Perish Song",
			version: "1.0",
			isSecret: true,
			clue: "Get knocked out together with the enemy",
		},
		{
			name: "Bring a Gun to a Knife Fight",
			version: "1.0",
			isSecret: true,
			clue: "Deal 20000 DMG or higher to an enemy whose HP percentage is equal to or lower than 1% in a single attack",
		},
		{
			name: "Deus Ex Machina",
			version: "1.0",
			isSecret: true,
			clue: "Inflict Weakness Break on enemies 3 time(s) using the Trailblazer (Destruction) in a single battle",
		},
		{
			name: "Four-and-a-Half Pirouettes",
			version: "1.0",
			isSecret: true,
			clue: "Trigger Herta's talent with an ally's single attack, and have her twirl 5 time(s)",
		},
		{
			name: "It's My Turn",
			version: "1.0",
			isSecret: true,
			clue: "Seele acts 5 time(s) in a row before the next ally unit's turn",
		},
		{
			name: "Trial of Thirteen",
			version: "1.0",
			isSecret: true,
			clue: "In a single battle, make Svarog block attacks toward Clara 13 times",
		},
		{
			name: "Coffee Lover",
			version: "1.0",
			clue: "A cup of coffee thrice a day, keeps the foggy head at bay",
		},
		{
			name: "Over-Protective",
			version: "1.0",
			isSecret: true,
			clue: "Win 1 battle(s) without having Gepard's Shields take any DMG",
		},
		{
			name: "Foolish Little Brother...",
			version: "1.0",
			isSecret: true,
			clue: "Use Serval to deal the final blow in a victory against boss Gepard",
		},
		{
			name: "Serval's Parting Gift",
			version: "1.0",
			isSecret: true,
			clue: "Use Serval to deal the final blow in a victory against boss Cocolia",
		},
		{
			name: "Listen...",
			version: "1.0",
			isSecret: true,
			clue: "Use the Trailblazer to fight boss Kafka and become Dominated by her",
		},
		{
			name: "I Don't Get No Respect!",
			version: "1.0",
			isSecret: true,
			clue: "Enrage the Guardian Shadow with 4 character(s) in your team",
		},
		{
			name: "Chad Norris",
			version: "1.0",
			clue: "Defeat the Guardian Shadow without enraging it",
		},
		{
			name: "Attack! No Matter the Cost!",
			version: "1.0",
			clue: "Trigger Silvermane Lieutenant's Shield Reflect at least 4 time(s) and defeat it",
		},
		{
			name: "Decapitation Strike",
			version: "1.0",
			clue: "Defeat the Silvermane Lieutenant without defeating any Silvermane Guards",
		},
		{
			name: "The Limping Lupine",
			version: "1.0",
			clue: "Defeat Automaton Direwolf without triggering Felling Order",
		},
		{
			name: "Regurgitation",
			version: "1.0",
			clue: "Cause Frigid Prowler to fail to use Devour Otherling",
		},
		{
			name: "Hit It Where It Hurts Most",
			version: "1.0",
			clue: "Defeat the Antimatter Engine without defeating either of the Doomsday Beast's hands in Echo of War",
		},
		{
			name: "Cataclysm Disruptor",
			version: "1.0",
			clue: "Prevent the doomsday Beast from using Impending Doom in Echo of War",
		},
		{
			name: '"Thank You for Your Service"',
			version: "1.0",
			clue: "Defeat Bronya without defeating the Silvermane Guards",
		},
		{
			name: "Achilles' Horse",
			version: "1.0",
			clue: "Defeat Voidranger: Trampler when it's aiming at an ally",
		},
		{
			name: "Doldrums",
			version: "1.0",
			clue: "Make Stormbringer fail to use Windfall Storm due to having no ally with Wind Shear",
		},
		{
			name: "Code of Chivalry",
			version: "1.0",
			clue: "Defeat Gepart without defeating the Silvermane Guards that were summoned",
		},
		{
			name: "Full Metal Jacket",
			version: "1.0",
			clue: "Stay alive after being hit by the Auxiliary Robot Arm Unit's Controlled Blasting ability",
		},
		{
			name: "Right-Hand Man's Many Right-Handed Right Hands",
			version: "1.0",
			clue: "Defeat Svarog after destroying 4 Auxiliary Robot Arm Unit(s)",
		},
		{
			name: "Homemade Crushed Ice",
			version: "1.0",
			clue: "Defeat the Ice Edge summoned by Cocolia 4 time(s)",
		},
		{
			name: "Road to Canossa",
			version: "1.0",
			clue: `Interrupt Cocolia's use of "Wrath of Winterland Saints" when she is charging`,
		},
		{
			name: "Save the Princess",
			version: "1.0",
			clue: "Defeat Cocolia without defeating Bronya",
		},
		{
			name: "Hot-Blooded",
			version: "1.0",
			clue: "Defeat Cocolia, Mother of Deception, without any ally being Frozen at any point of the battle in Echo of War",
		},
		{
			name: "Accidental Amnesia",
			version: "1.0",
			clue: "Clear Decaying Shadow's Gauge Recollection and cause its ability, Liberation of the Golden Age, to fail",
		},
		{
			name: "Friendly Fire",
			version: "1.0",
			clue: `Defeat the Aurumaton Gatekeeper with the Entranced Ingenium: Illumination Dragonfish's "Candle Flame"`,
		},
		{
			name: "Wrathful Aurumaton",
			version: "1.0",
			clue: "In a single battle, cause Aurumaton Gatekeeper to enter the Wrath state 3 times",
		},

		// in-game position check
		{
			name: "Will of Steel",
			version: "1.0",
			isSecret: true,
			clue: "In a single battle against boss Kafka, dispel Dominated 3 times",
		},
		{
			name: "Et tu, Bronya?",
			version: "1.0",
			isSecret: true,
			clue: "Use Bronya to deal the final blow in a victory against boss Cocolia",
		},
		{
			name: "Surge of Tiles",
			version: "1.0",
			isSecret: true,
			clue: 'Qingque starts her turn in the "Hidden Hand" state for 3 turn(s) in a row',
		},
		{
			name: "When the National Anthem Rings",
			version: "1.0",
			isSecret: true,
			clue: 'Have ally Bronya use "The Belobog March" 1 time(s) when fighting the bosses Gepard, Cocolia, and Bronya respectively',
		},
		{
			name: "This Fragile Body",
			version: "1.1",
			isSecret: true,
			clue: "Use Silver Wolf to apply different Type Weaknesses for a total of 3 time(s) to a single enemy in a single battle",
		},
		{
			name: "When the Hunter Becomes the Hunted",
			version: "1.1",
			isSecret: true,
			clue: "Use Silver Wolf to fight enemy Kafka and apply 2 Weaknesse(s) to her in a single battle",
		},
	],
	"vestige-of-luminflux": [
		{
			name: "The Express Passenger's Guide to the Galaxy",
			version: "1.0",
			clue: "Obtain 10 characters",
		},
		{
			name: "Express Crew Roster",
			version: "1.0",
			clue: "Obtain 20 characters",
		},
		{
			name: "Ripples on the Dirac Sea (I)",
			version: "1.0",
			clue: "Obtain 10 type(s) of Light Cones",
		},
		{
			name: "Ripples on the Dirac Sea (II)",
			version: "1.0",
			clue: "Obtain 20 type(s) of Light Cones",
		},
		{
			name: "Ripples on the Dirac Sea (III)",
			version: "1.0",
			isSecret: true,
			clue: "Obtain 40 type(s) of Light Cones",
		},
		{
			name: "Supreme Treasure of the Netherworld",
			version: "1.0",
			clue: "Obtain a 5-star Relic",
		},
		{
			name: "Fate/stranger Fake",
			version: "1.0",
			clue: "Obtain 5 5-star Relic(s) from Omni-Synthesizer",
		},
		{
			name: "Texting Enjoyer",
			version: "1.1",
			clue: "Reply to 10 idle chat texts from other characters",
		},
		{
			name: "That Friendship Has Sailed",
			version: "1.1",
			clue: "Reply to 60 idle chat texts from other characters",
		},

		// in-game position check
		{
			name: "The Great Interastral Migration",
			version: "1.0",
			isSecret: true,
			clue: "Obtain 50 characters",
		},
		{
			name: "Interastral Peace Diamond Membership",
			version: "1.0",
			isSecret: true,
			clue: "Obtain 1,000,000 credits in total",
		},
		{
			name: "Interastral Peace Supreme Diamond Membership",
			version: "1.0",
			isSecret: true,
			clue: "Obtain 10,000,000 credits in total",
		},
		{
			name: "Mega Rich Light-Bending Guy",
			version: "1.0",
			isSecret: true,
			clue: "Obtain 100,000,000 credits in total",
		},
	],
	"universe-in-a-nutshell": [
		{
			name: "The First and Last Freedom",
			version: "1.0",
			clue: "Enter battle with 4 allies with HP percentage equal to or less than 1% in Simulated Universe",
		},
		{
			name: "The Art of Loving",
			version: "1.0",
			clue: "Allies receive Shields 50 times in Simulated Universe",
		},
		{
			name: "Freeze!",
			version: "1.0",
			clue: "Keep a single enemy Frozen for 10 turns in Simulated Universe",
		},
		{
			name: "Elemental Reaction System",
			version: "1.0",
			clue: "Deal 5 or more Types of DMG in a single attack in Simulated Universe",
		},
		{
			name: "Your Opponent Has Poor Connection",
			version: "1.0",
			clue: "Allies take consecutive actions 20 time(s) in Simulated Universe",
		},
		{
			name: "Twenty Four Love Poems and a Song of Despair",
			version: "1.0",
			clue: "All allies have HP percentages equal to or less than 5% when winning a battle in Simulated Universe",
		},
		{
			name: "We Call the Heart Dancing in the Dark the Moon",
			version: "1.0",
			clue: "Have at least 3 enemy unit(s) be afflicted with Shock, Burn, Bleed, and Wind Shear simultaneously in Simulated Universe",
		},
		{
			name: "Good Night, My Friend",
			version: "1.0",
			clue: "Defeat 15 enemies in Simulated Universe",
		},
		{
			name: "Ready Player One",
			version: "1.0",
			clue: "Defeat 1,000 enemies in Simulated Universe",
		},
		{
			name: "Consumerism Psychology",
			version: "1.0",
			clue: "Obtain 500 Cosmic Fragment(s)",
		},
		{
			name: "The Great Cosmic Gatsby",
			version: "1.0",
			clue: "Obtain 20,000 Cosmic Fragment(s)",
		},
		{
			name: "A Special Experience",
			version: "1.0",
			clue: "Encounter 10 Special Event(s) in Simulated Universe",
		},
		{
			name: "A Not-So-Special Experience",
			version: "1.0",
			clue: "Encounter 100 Special Event(s) in Simulated Universe",
		},
		{
			name: "A Room of One's Own",
			version: "1.0",
			clue: "Complete exploring Simulated Universe: World 1",
		},
		{
			name: "Penrose Stairs",
			version: "1.0",
			clue: "Complete exploring Simulated Universe at difficulty level 2 or higher",
		},
		{
			name: "King of Infinity",
			version: "1.0",
			clue: "Complete exploring Simulated Universe at difficulty level 4 or higher",
		},
		{
			name: "Fevered Strike",
			version: "1.0",
			clue: "Break 20 destructible object(s) in Simulated Universe",
		},
		{
			name: "Rosebud",
			version: "1.0",
			clue: "Break 400 destructible object(s) in Simulated Universe",
		},
		{
			name: "Adrenaline",
			version: "1.0",
			clue: "Actively Enhance Blessings 10 times in Simulated Universe",
		},
		{
			name: "Infectious Good Luck",
			version: "1.0",
			clue: "Actively Enhance Blessings 200 times in Simulated Universe",
		},
		{
			name: "Do Android Snails Dream of Electric Trees?",
			version: "1.0",
			clue: "Activate abilities in the Ability Tree 2 times",
		},
		{
			name: "Expert Tree-Climber",
			version: "1.0",
			clue: "Activate abilities in the Ability Tree 26 times",
		},
		{
			name: "My Swiss Army Curios",
			version: "1.0",
			clue: "Unlock 3 Curios in Simulated Universe",
		},
		{
			name: "Life Is but a Game",
			version: "1.0",
			clue: "Unlock 40 Curios in Simulated Universe",
		},
		{
			name: "Who Moved My Pokeball?",
			version: "1.0",
			clue: "Capture Trotters 1 times in Simulated Universe",
		}, // (in-game typo) times => time
		{
			name: "A Porcine Football Team",
			version: "1.0",
			clue: "Capture Trotters 66 times in Simulated Universe",
		},
		{
			name: "Don't Let It Get Away!",
			version: "1.0",
			isSecret: true,
			clue: "Let Trotters escape 1 times in Simulated Universe",
		}, // (in-game typo) times => time
		{
			name: "Existence Precedes Essence",
			version: "1.0",
			clue: "Unlock 12 Blessing(s) of Preservation in Simulated Universe",
		},
		{
			name: "Memories Look at Me",
			version: "1.0",
			clue: "Unlock 12 Blessing(s) of Remembrance in Simulated Universe",
		},
		{
			name: "Create A Beautiful Chaos",
			version: "1.0",
			clue: "Unlock 12 Blessing(s) of Elation in Simulated Universe",
		},
		{
			name: "Velocity of the Universe's Expansion",
			version: "1.0",
			clue: "Unlock 12 Blessing(s) of The Hunt in Simulated Universe",
		},
		{
			name: "Wreck-It Self",
			version: "1.0",
			clue: "Unlock 12 Blessing(s) of Destruction in Simulated Universe",
		},
		{
			name: "Gnosticism",
			version: "1.0",
			clue: "Unlock 12 Blessing(s) of Nihility in Simulated Universe",
		},
		{
			name: "Exhalation",
			version: "1.0",
			clue: "Unlock 12 Blessing(s) of Abundance in Simulated Universe",
		},
		{
			name: "Millenium Bug in Amber",
			version: "1.0",
			clue: "Have 10 or more Blessing(s) of Preservation when clearing Simulated Universe",
		},
		{
			name: "You See Memories",
			version: "1.0",
			clue: "Have 10 or more Blessing(s) of Remembrance when clearing Simulated Universe",
		},
		{
			name: "Don't Worry Be Happy",
			version: "1.0",
			clue: "Have 10 or more Blessing(s) of Elation when clearing Simulated Universe",
		},
		{
			name: "The Speed of Thought",
			version: "1.0",
			clue: "Have 10 or more Blessing(s) of The Hunt when clearing Simulated Universe",
		},
		{
			name: "Cool Guys Don't Look At Explosions",
			version: "1.0",
			clue: "Have 10 or more Blessing(s) of Destruction when clearing Simulated Universe",
		},
		{
			name: "The Plague of Fantasies",
			version: "1.0",
			clue: "Have 10 or more Blessing(s) of Nihility when clearing Simulated Universe",
		},
		{
			name: "Angel's Breath",
			version: "1.0",
			clue: "Have 10 or more Blessing(s) of Abundance when clearing Simulated Universe",
		},
		{
			name: "A Finger in Every Pie",
			version: "1.0",
			clue: "Have Blessings from 6 or more Paths when clearing Simulated Universe",
		},
		{
			name: "An Island Unto Oneself",
			version: "1.0",
			clue: "Have 6 or less Blessing(s) when clearing Simulated Universe at difficulty 2 or higher",
		},
		{
			name: "Private Collector",
			version: "1.0",
			clue: "Have 22 or more Blessing(s) when clearing Simulated Universe",
		},
		{
			name: "Triangle Strategy",
			version: "1.0",
			clue: "Flip cards 3 times in a single Nildis event in Simulated Universe",
		},
		{
			name: "Master Ball",
			version: "1.0",
			clue: "Have 8 or more Curio(s) when clearing Simulated Universe",
		},
		{
			name: "A 4-Star Rarity Daydream",
			version: "1.0",
			clue: "Have 0 or less Cosmic Fragment(s) when clearing Simulated Universe",
		},
		{
			name: "It's Good to Be Rich!",
			version: "1.0",
			clue: "Have 1,024 or more Cosmic Fragment(s) when clearing Simulated Universe",
		},
		{
			name: "On Fire off the Shoulder of Orion",
			version: "1.0",
			isSecret: true,
			clue: "Lose against Elite enemies in Simulated Universe",
		},
		{
			name: "Glitter at the Tannhauser Gate",
			version: "1.0",
			isSecret: true,
			clue: "Lose against the Boss enemies in Simulated Universe",
		},
		{
			name: "Wake Up!",
			version: "1.0",
			isSecret: true,
			clue: "Lose the battle in the Nildis event in Simulated Universe",
		},
		{
			name: "Lost Like Tears in Rain",
			version: "1.0",
			isSecret: true,
			clue: "Lose the battle in the tavern event in Simulated Universe",
		},
		{
			name: "Console Game",
			version: "1.0",
			isSecret: true,
			clue: "Clear Simulated Universe at difficulty 2 or higher without using the Downloader",
		},
		{
			name: "If I Can Stop One Heart From Breaking",
			version: "1.0",
			isSecret: true,
			clue: "Clear Simulated Universe at difficulty 2 or higher without breaking any destructible objects",
		},
		{
			name: "The Grand Budapest Hotel",
			version: "1.0",
			clue: "Clear Simulated Universe at difficulty 2 or higher and use Techniques 25 times",
		},
		{
			name: "Aleph is the Universe",
			version: "1.0",
			isSecret: true,
			clue: "Clear Simulated Universe at difficulty 2 or higher with only 1 character in the team",
		},
		{
			name: "Coherence",
			version: "1.0",
			clue: "Clear Simulated Universe at difficulty 2 or higher with 4 characters of the same Path",
		},
		{
			name: "Does This Game Not Have a Platinum Trophy?",
			version: "1.0",
			clue: "Clear Simulated Universe (Difficulty Level 2 and above) with all allies at full HP at the end of every battle",
		},
	],
	"glory-of-the-unyielding": [
		{
			name: "Shadows Die Ad Infinitum (I)",
			version: "1.0",
			clue: "Defeat Stagnant Shadow 100 time(s)",
		},
		{
			name: "Shadows Die Ad Infinitum (II)",
			version: "1.0",
			clue: "Defeat Stagnant Shadow 400 time(s)",
		},
		{
			name: "Shadows Die Ad Infinitum (III)",
			version: "1.0",
			clue: "Defeat Stagnant Shadow 800 time(s)",
		},
		{
			name: "Day of the Triffids (I)",
			version: "1.0",
			clue: "Defeat Calyx 100 time(s)",
		},
		{
			name: "Day of the Triffids (II)",
			version: "1.0",
			clue: "Defeat Calyx 500 time(s)",
		},
		{
			name: "Day of the Triffids (III)",
			version: "1.0",
			clue: "Defeat Calyx 1000 time(s)",
		},
		{
			name: "Phantom of the Cavern (I)",
			version: "1.0",
			clue: "Complete Caverns of Corrosion 100 time(s)",
		},
		{
			name: "Phantom of the Cavern (II)",
			version: "1.0",
			clue: "Complete Caverns of Corrosion 400 time(s)",
		},
		{
			name: "Phantom of the Cavern (III)",
			version: "1.0",
			clue: "Complete Caverns of Corrosion 800 time(s)",
		},
		{
			name: "Echo of War (I)",
			version: "1.0",
			clue: "Complete Echo of War 1 time(s)",
		},
		{
			name: "Echo of War (II)",
			version: "1.0",
			clue: "Complete Echo of War 10 time(s)",
		},
	],
	"moment-of-joy": [
		{
			name: "Earth Week",
			version: "1.0",
			clue: "Log in 7 days in a row",
		},
		{
			name: "Earth Month",
			version: "1.0",
			clue: "Log in for a total of 30 days",
		},
		{
			name: "Diogenes' Utopia",
			version: "1.0",
			clue: "See what Belobog is famous for!",
		},
		{
			name: "Insatiable",
			version: "1.0",
			clue: "Sometimes, there can be too much of a good thing...",
		},
		{
			name: "Trashy Humor",
			version: "1.0",
			clue: "One man's trash is another man's treasure",
		},
		{
			name: "Karmic Wheel",
			version: "1.0",
			clue: "Let the Higher Existence that lives within our hearts sigh at you",
		},
		{
			name: "Saint",
			version: "1.0",
			clue: "Let the Higher Existence that lives within our heats give you a thumbs-up",
		},
		{
			name: "It Takes Three",
			version: "1.0",
			clue: "Win a battle with a team that has 3 characters of the same Path",
		},
		{
			name: "Match-Three",
			version: "1.0",
			clue: "Win a battle with a team that has 3 characters of the same Type",
		},

		// in-game position check
		{
			name: "Earth Year",
			version: "1.0",
			isSecret: true,
			clue: "Log in for a total of 365 days",
		},
		{
			name: "Versatile Joker",
			version: "1.0",
			isSecret: true,
			clue: "Use a total of 20 character(s) to form a team with Sampo and win at least 1 battle",
		},
		{
			name: "One Big Happy Family",
			version: "1.0",
			isSecret: true,
			clue: "Win 1 battle(s) with a team comprising Himeko, Welt, Dan Heng, and March 7th",
		},
		{
			name: "Architects (And Former Architects)",
			version: "1.0",
			isSecret: true,
			clue: "Win 1 battle(s) with a team comprising Bronya, Gepard, Pela, and Serval",
		},
		{
			name: "Star Saga of the Shattered Sword",
			version: "1.1",
			isSecret: true,
			clue: "Win 1 battle(s) with a team comprising Luocha, Sushang, and Yanqing",
		},
		{
			name: "Hot-Blooded Trailblazer",
			version: "1.0",
			isSecret: true,
			clue: "Choose hot-blooded dialogue options 5 time(s)",
		},
		{
			name: "Pessimistic Trailblazer",
			version: "1.0",
			isSecret: true,
			clue: "Choose pessimistic dialogue options 5 time(s)",
		},
		{
			name: "Apologetic Trailblazer",
			version: "1.0",
			isSecret: true,
			clue: "Choose apologetic dialogue options 5 time(s)",
		},
		{
			name: "Silent Trailblazer",
			version: "1.0",
			isSecret: true,
			clue: "Choose silent dialogue options 5 time(s)",
		},
		{
			name: "The Echoer",
			version: "1.0",
			isSecret: true,
			clue: "Choose repetitive dialogue options 3 time(s)",
		},
		{
			name: "The Meaning of Choice",
			version: "1.0",
			isSecret: true,
			clue: "Choose gender-specific dialogue options 3 time(s)",
		},
		{
			name: "Lone Wolf",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with only one character on the team",
		},
		{
			name: "For the Amber Lord",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 characters following the Path of Preservation.",
		},
		{
			name: "Ablution Dictum",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 characters following the Path of Destruction.",
		},
		{
			name: "The Xianzhou Alliance",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 characters following the Path of The Hunt.",
		},
		{
			name: "Meaningless Achievement",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 characters following the Path of Nihility.",
		},
		{
			name: "The Great Accord",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 characters following the Path of Harmony.",
		},
		{
			name: "Knowledge is Power",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 characters following the Path of Erudition.",
		},
		{
			name: "Miracles of Yaoshi",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 characters following the Path of Abundance.",
		},
		{
			name: "Tempestuous Suppression",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 Wind-Type characters.",
		},
		{
			name: "Fulguration Beckoner",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 Lightning-Type characters.",
		},
		{
			name: "Total Conflagration",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 Fire-Type characters.",
		},
		{
			name: "Glacier Dynast",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 Ice-Type characters.",
		},
		{
			name: "Quantum Test",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 Quantum-Type characters.",
		},
		{
			name: "Imaginary Law",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 Imaginary-Type characters.",
		},
		{
			name: "Speak with Fists",
			version: "1.0",
			isSecret: true,
			clue: "Win 10 battles with a team that has 4 Physical-Type characters.",
		},
		{
			name: "Life in All Its Forms",
			version: "1.1",
			isSecret: true,
			clue: "Trigger 10 different HP restoration voice lines with Luocha's healing",
		},
	],
	"the-memories-we-share": [
		{
			name: "Guess Who I Am",
			version: "1.0",
			clue: 'Complete Companion Mission "You Already Know Me"',
		},
		{
			name: "The Sorrows of Young Arlan",
			version: "1.0",
			clue: 'Complete Companion Mission "An Unexpected Turn of Events"',
		},
		{
			name: "The Gift of the Magi",
			version: "1.0",
			clue: `Complete Companion Mission "Hook's Gift"`,
		},
		{
			name: "The Outskirts Here Are Quiet",
			version: "1.0",
			clue: 'Complete Companion Mission "Blizzard Immunity"',
		},
		{
			name: "Clara and the Sun",
			version: "1.0",
			clue: 'Complete Companion Mission "Rarely Affectionate"',
		},
		{
			name: "Serval's Faithfull: An Autobiography",
			version: "1.0",
			clue: 'Complete Companion Mission "Only A Child"',
		}, // (in-game typo) Faithfull => Faithful
		{
			name: "A Perfect Detective",
			version: "1.1",
			isSecret: true,
			clue: 'Complete the Companion Mission "A Knight Stranger"',
		},
		{
			name: "Master Among Swords",
			version: "1.1",
			isSecret: true,
			clue: `Complete the Companion Mission "Frosty Blade's Trial"`,
		},
		{
			name: "Farewell, Punklorde!",
			version: "1.1",
			isSecret: true,
			clue: 'Complete the Companion Mission "Punklorde Mentality"',
		},
		{
			name: "Coffin Dancer",
			version: "1.1",
			clue: "Witness Luocha's hidden side",
		},
		{
			name: "Free For Today",
			version: "1.1",
			isSecret: true,
			clue: "Open up the general exhibition area of the Belobog History and Culture Museum",
		},
		{
			name: "You Should Stay in the Museum!",
			version: "1.1",
			isSecret: true,
			clue: "Collect all display items for the Belobog History and Culture Museum",
		},
		{
			name: "Catch Me If You Can",
			version: "1.1",
			isSecret: true,
			clue: "Open up three exhibition areas in the Belobog History and Culture Museum",
		},
		{
			name: ["For Old Times' Sake", "Where Can A Wanderer Rest?"],
			version: "1.1",
			isSecret: true,
		},
		{
			name: "Seventeen's Map",
			version: "1.0",
			isSecret: true,
			clue: 'Find all readable items regarding Asta in the mission "Emptiness of Locus Silentii"',
		},
		{
			name: "Diamond and Rust",
			version: "1.0",
			isSecret: true,
			clue: 'Give the log to Bernard in the mission, "To: The Faint Star"',
		},
		{
			name: "Farewell, Comet Hunter",
			version: "1.0",
			isSecret: true,
			clue: 'Collect three "Letters From the Comet Hunter" in the mission "Out of Reach"',
		},
		{
			name: "Does She Walk Alone?",
			version: "1.0",
			isSecret: true,
			clue: `Complete the mission "Guide Paradox" and witness the android's ending`,
		},
		{
			name: "Close Encounters of the Sixth Kind",
			version: "1.0",
			isSecret: true,
			clue: 'Obtain the ability to communicate with Wubbabboos in the mission "Requiem Mass"',
		},
		{
			name: "Disposable",
			version: "1.0",
			isSecret: true,
			clue: "Find and talk to all Herta puppets in the space station",
		},
		{
			name: "When Breath Becomes Air",
			version: "1.0",
			isSecret: true,
			clue: "Visit the researcher Eikura Shuu's memorial",
		},
		{
			name: "Bzzt! Clock Out!",
			version: "1.0",
			isSecret: true,
			clue: "Turn off the little robots in the space station 6 times",
		},
		{
			name: "Door to A New World",
			version: "1.0",
			isSecret: true,
			clue: 'Use the Curio "Door to A New World"',
		},
		{
			name: "Just A Number",
			version: "1.0",
			isSecret: true,
			clue: 'Use the Curio "Rating Pistol"',
		},
		{
			name: "No King Rules Forever",
			version: "1.0",
			isSecret: true,
			clue: 'Use the Curio "Unbearable Weight" and decipher the contents of the mysterious sound',
		},
		{
			name: "Green Thumb",
			version: "1.0",
			isSecret: true,
			clue: "Talk with the strange plant and visit it again on the next day",
		},
		{
			name: "Greed Psychology",
			version: "1.0",
			isSecret: true,
			clue: 'Obtain the real treasure in the mission "Survival Wisdom"',
		},
		{
			name: "One Day More",
			version: "1.0",
			isSecret: true,
			clue: `Find all of Julian's items in the mission "Hook's Treasure"`,
		},
		{
			name: "Moral Higher Ground",
			version: "1.0",
			isSecret: true,
			clue: "Confront the Public Property Protector and show him the cost of stopping you (or have him humbly acknowledge his wrongdoing.)",
		},
		{
			name: "Outworlder",
			version: "1.0",
			isSecret: true,
			clue: "Return the music box found in Rivet Town to its heartbroken owner",
		},
		{
			name: ["For a Breath I Tarry", "The Lifecycle of Software Objects"],
			version: "1.0",
			isSecret: true,
			clue: [
				'Choose to format Little Robot in the mission "Rarely Affectionate (Part 2)"',
				'Choose not to format Little Robot in the mission "Rarely Affectionate (Part 2)"',
			],
		},
		{
			name: "50 Credits!?",
			version: "1.0",
			isSecret: true,
			clue: "Collect all wanted posters of the Express Crew in Belobog",
		},
		{
			name: "Twinkly, Winkly",
			version: "1.0",
			isSecret: true,
			clue: "Obtain 3 Ancient Coin(s)",
		},
		{
			name: "Sweet Pom-Pom O'Mine",
			version: "1.0",
			isSecret: true,
			clue: "Try to give the Jarilo-VI's armillary sphere a spin to find... um... Pom-Pom on it?",
		},
		{
			name: "Hurt Locker",
			version: "1.0",
			isSecret: true,
			clue: "Solve the crisis at the Belobog cable car station while also avoiding ethical risks",
		},
		{
			name: "Where It All Began",
			version: "1.0",
			isSecret: true,
			clue: "Return to the room where the Stellaron was kept and recall a blurred memory",
		},
		{
			name: "Knight in Shining Armor",
			version: "1.0",
			isSecret: true,
			clue: "Find the language model and give it to Fidora the amateur mechanic",
		},
		{
			name: "Honest Abe",
			version: "1.0",
			isSecret: true,
			clue: "Pass the test of integrity set up by a mysterious researcher",
		},
		{
			name: "The Mandela Effect",
			version: "1.0",
			isSecret: true,
			clue: `Contact Belobog's "back alley"`,
		},
		{
			name: "Natural Immunity",
			version: "1.0",
			isSecret: true,
			clue: "Obtain the recipe for fried rice from talking with Gertie at the Goethe Grand Hotel",
		},
		{
			name: "Lā Lá Lǎ Là Land",
			version: "1.0",
			isSecret: true,
			clue: "Obtain the score for the phonograph from talking with Tamila at the Golden Theater",
		},
		{
			name: "Winter City Trap",
			version: "1.0",
			isSecret: true,
			clue: "Finish listening to the vagrant's rap",
		},
		{
			name: "For Ages 12 and Up",
			version: "1.0",
			isSecret: true,
			clue: "Participate in the Dark Fist Tournament and become the ultimate winner",
		},
		{
			name: "Dance Like A Butterfly, Sting Like A Bee",
			version: "1.0",
			isSecret: true,
			clue: "Dominate all 5 tournaments in the Boulder Town Super League",
		},
		{
			name: "The Kelly Gang",
			version: "1.0",
			isSecret: true,
			clue: "Excavate the treasure hidden in the Belobog Administrative District's fountain",
		},
		{
			name: "The Banality of Evil",
			version: "1.0",
			isSecret: true,
			clue: `Finish all the Fool's Box puzzles in the mission "Vessel of Mediocrity"`,
		},
		{
			name: "The Fourth Little Mole",
			version: "1.0",
			isSecret: true,
			clue: 'Find all the hidden treasure in the Mission "The Adventurous Moles"',
		},
		{
			name: "The Adventurous Moles Super Grown-Up Edition",
			version: "1.0",
			isSecret: true,
			clue: "Buy The Adventurous Moles: Hidden Treasure from the Belobog Book Merchant",
		},
		{
			name: "A Simple Life",
			version: "1.0",
			isSecret: true,
			clue: 'Receive a text from Luhui after completing the mission "Fired"',
		},
		{
			name: "Carpe Diem, Festina Lente, and Tempus Fugit",
			version: "1.0",
			isSecret: true,
			clue: `Revving up, Losing Steam, and Running On Empty. Receive all the texts about Chengjie's fading passion after completing the mission "A Teacher and a Friend".`,
		},
		{
			name: ["Tootsie", "Cyber Fraud", "A Secret Makes a Woman, Woman."],
			version: "1.0",
			isSecret: true,
			clue: [
				'Choose to have the Foxian Beauty reveal their true identity during the mission "From Xianzhou With Love"',
				'Choose to have the Foxian Beauty turn themselves in during the mission "From Xianzhou With Love"',
				'Choose to let the Foxian Beauty continue the ruse during the mission "From Xianzhou With Love"',
			],
		},
		{
			name: "The Seven Errors of Cycranes: Sloth",
			version: "1.0",
			isSecret: true,
			clue: "Convince the depressed cycrane to return to its job",
		},
		{
			name: "Seven Birds in the Hand Is Worth A Thousand in the Bush",
			version: "1.0",
			isSecret: true,
			clue: "Help Heron Express to recover all lost cycranes",
		},
		{
			name: [
				"Fair and Square",
				"All Is Fair in Love and War",
				"From Hero to Zero",
			],
			version: "1.0",
			isSecret: true,
			clue: [
				"Win the Xianzhou Luofu Competitive Eater Championship openly and fairly",
				"Win the Xianzhou Luofu Competitive Eater Championship in underhanded ways",
				"Lose the Xianzhou Luofu Competitive Eater Championship",
			],
		},
		{
			name: ["Far From the Madding Crowd", "Let the Wind Blow Where It May"],
			version: "1.0",
			isSecret: true,
			clue: [
				"Talk with the Immortal in a Vase and obtain its gift from the vase",
				"Talk with the Immortal in a Vase and refuse its gift",
			],
		},
		{
			name: "Hasta la vista, Hexanexus!",
			version: "1.0",
			isSecret: true,
			clue: "Complete 15 Hexanexus challenge(s) from the Hex Club",
		},
		{
			name: "Rubik's Headache",
			version: "1.0",
			isSecret: true,
			clue: "Complete 15 new Hexanexus challenge(s) from the Hex Club",
		},
		{
			name: "Labor Omnia Vincit",
			version: "1.0",
			isSecret: true,
			clue: "Examine 3 separate file cabinets in the Seat of Divine Foresight",
		},
		{
			name: ["The Crimes That Bind", "Flight Cancelled"],
			version: "1.0",
			isSecret: true,
			clue: [
				"Stop the strange tourist from throwing a coin into the starskiff engine",
				"Help the strange tourist to throw a coin into the starskiff engine",
			],
		},
		{
			name: ["Lost and Found", "Leave It There", "Have Your Cake and Eat It"],
			version: "1.0",
			isSecret: true,
			clue: [
				"Retrieved the credits that the fraudster took",
				"Did not retrieve the credits that the fraudster took",
				"Retrieved more credits from the fraudster than what they took",
			],
		},
		{
			name: "The Seven Errors of Cycranes: Lust",
			version: "1.0",
			isSecret: true,
			clue: "Follow the gentlemanly cycrane to find the picture book withheld by customs",
		},
		{
			name: "The Seven Errors of Cycranes: Gluttony",
			version: "1.0",
			isSecret: true,
			clue: "Complete a bet with the dissatisfied cycrane",
		},
		{
			name: "The Seven Errors of Cycranes: Greed",
			version: "1.0",
			isSecret: true,
			clue: 'Explore the "mountain of deliveries" protected by the "evil dragon"',
		},
		{
			name: "The Seven Errors of Cycranes: Envy",
			version: "1.0",
			isSecret: true,
			clue: "Complete the challenge from the resentful cycrane",
		},
		{
			name: "The Seven Errors of Cycranes: Wrath",
			version: "1.0",
			isSecret: true,
			clue: "Defeat the highwaymen with the brave cycrane",
		},
		{
			name: "The Seven Errors of Cycranes: Pride",
			version: "1.0",
			isSecret: true,
			clue: 'Complete the challenge from the "Four Great Villains of the Luofu (Self-Proclaimed)"',
		},
	],
	"fathom-the-unfathomable": [
		{
			name: "Until the Light Takes Us",
			version: "1.0",
			clue: "Activate 5 Space Anchors in the Herta Space Station",
		},
		{
			name: "Unopen World",
			version: "1.0",
			clue: "Activate 14 Space Anchors in Belobog",
		},
		{
			name: "Where the Celestial Path May Lead",
			version: "1.0",
			clue: "Activate 14 Space Anchors on the Xianzhou Luofu",
		},
		{
			name: "Proper Role-Playing Gamer",
			version: "1.0",
			clue: "Open Treasures 30 times on the Herta Space Station",
		},
		{
			name: "But at What Cost?",
			version: "1.0",
			clue: "Open Treasures 110 times in Belobog",
		},
		{
			name: "A Drop in the Bucket",
			version: "1.0",
			clue: "Open Treasures 100 time(s) on the Xianzhou Luofu",
		},
		{
			name: "Destructive Impulse",
			version: "1.0",
			clue: "Destroy 100 destructible objects",
		},
		{
			name: "Free Will of Destruction",
			version: "1.0",
			clue: "Destroy 1,000 destructible objects",
		},
		{
			name: "Take by Surprise",
			version: "1.0",
			clue: "Enter combat with attacks of corresponding Types for 100 time(s)",
		},
		{
			name: "Can't See Behind",
			version: "1.0",
			clue: "Ambushed during exploration",
		},
		{
			name: "The Tertiary Power",
			version: "1.0",
			clue: "Use Technique 50 time(s)",
		},
		{
			name: "The Tertiary Dimension",
			version: "1.0",
			clue: "Use Technique 300 time(s)",
		},
		{
			name: "Dissertation Proposal",
			version: "1.0",
			clue: "Collect 10 readable item(s) in the Herta Space Station",
		},
		{
			name: "Literature Review",
			version: "1.0",
			clue: "Collect 50 readable item(s) in the Herta Space Station",
		},
		{
			name: "Non-pulp Fiction",
			version: "1.0",
			clue: "Collect 20 readable item(s) in Belobog",
		},
		{
			name: "Everwinter City's Resident Historian",
			version: "1.0",
			clue: "Collect 80 readable item(s) in Belobog",
		},
		{
			name: "Glued to Books",
			version: "1.0",
			clue: "Collect 30 readable items from the Xianzhou Luofu",
		},
		{
			name: "Learned in All Things",
			version: "1.0",
			isSecret: true,
			clue: "Collect 80 readable items from the Xianzhou Luofu",
		}, // in-game position check
		{
			name: "Red-Name Alert",
			version: "1.0",
			clue: "Complete the Formidable Foe Challenge 5 time(s)",
		},
		{
			name: "High-Level Domination",
			version: "1.0",
			clue: "Complete the Formidable Foe Challenge 15 time(s)",
		},
		{
			name: "Inter-Domain Roaming",
			version: "1.0",
			clue: "Complete Warring Expedition 1 time(s)",
		},
		{
			name: "You Want Me to Raid Without Achievements?",
			version: "1.0",
			clue: "Complete Warring Expedition 9 time(s)",
		},
		{
			name: "Tindalos Piggy",
			version: "1.0",
			clue: "Capture Warp Trotter 1 time(s)",
		},
		{
			name: "Phase ATM",
			version: "1.0",
			clue: "Capture Warp Trotter 10 time(s)",
		},
		{
			name: "Sensory Socialization",
			version: "1.0",
			isSecret: true,
			clue: "Collect all Memory Bubbles scattered on the Herta Space Station",
		},
		{
			name: "Unearthly Marvel",
			version: "1.0",
			clue: "Find all of the Unearthly Marvel treasures",
		},
		{
			name: "The Seven-Bridges Problem",
			version: "1.0",
			clue: "Find all repulsion bridge treasures",
		},
		{
			name: "The Birth of Tragedy",
			version: "1.0",
			clue: "Find all of The Fool's Box treasures",
		},
		{
			name: "Sisyphus of the Mines",
			version: "1.0",
			clue: "Complete the final Mine Cart Test",
		},
		{
			name: "The Tale of Moles",
			version: "1.0",
			clue: clueBuilder("Collect all of The Adventurous Moles", {
				italic: ["The Adventurous Moles"],
			}),
		},
		{
			name: "Red to Red and White to White",
			version: "1.0",
			clue: "Complete Magflow Link 10 time(s)",
		},
		{
			name: "Don't You Dare Waste It",
			version: "1.0",
			clue: "Get Jim Roger Bread Soda from a trash can",
		},
		{
			name: "A Metaphor of Caves",
			version: "1.0",
			clue: "Complete the Hexanexus 30 time(s)",
		},
		{
			name: "North by Northwest",
			version: "1.0",
			clue: "Complete the Formation-Breaking Compass 20 time(s)",
		},
		{
			name: "Walk Into The Trap",
			version: "1.1",
			isSecret: true,
			clue: "Capture Lost Trotters 1 time(s) in battle",
		},
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

type Version = `${number}.${number}`

type Achievement = {
	name: string | string[]
	version: Version
	clue?: string | string[]
	isSecret?: boolean
}

type Metadata = {
	currentVersion: Version
	size: { [k in Version]: number }
}

export type {
	CategoryName,
	SlugifiedCategoryName,
	Category,
	Achievement,
	Metadata as AchievementMetadata,
}
export { metadata as achievementMetadata, achievementByCategory, categories }
