DROP TABLE IF EXISTS cards;

DROP TYPE IF EXISTS card_type;

CREATE TYPE card_type AS ENUM ('monster', 'weapon', 'aid');

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    card_type card_type NOT NULL,
    level INT NOT NULL,
    image_url TEXT,
    description TEXT
);


INSERT INTO cards (name, card_type, level, image_url, description) 
VALUES
-- LEVEL 2
('Goblin Scout',           'monster', 2, '/images/monsters/goblin_scout.png',          'A weak but nimble goblin, barely armed.'),
('Cave Rat Swarm',         'monster', 2, '/images/monsters/cave_rat_swarm.png',        'A chittering mass of diseased rats.'),
('Cracked Dagger',         'weapon',  2, '/images/weapons/cracked_dagger.png',         'Barely sharp, but better than your fists.'),
('Minor Red Herb',         'aid',     2, '/images/aids/minor_red_herb.png',            'A simple herb that restores a sliver of vitality.'),

-- LEVEL 3
('Sewer Slime',            'monster', 3, '/images/monsters/sewer_slime.png',           'Slow, corrosive, and disturbingly persistent.'),
('Tomb Bat',               'monster', 3, '/images/monsters/tomb_bat.png',              'Bites from the shadows and flees.'),
('Rusty Shortsword',       'weapon',  3, '/images/weapons/rusty_shortsword.png',       'Old and pitted, but still cuts.'),
('Weak Healing Tonic',     'aid',     3, '/images/aids/weak_healing_tonic.png',        'A thin brew that closes minor wounds.'),

-- LEVEL 4
('Crypt Spider',           'monster', 4, '/images/monsters/crypt_spider.png',          'A venomous spider that nests in coffins.'),
('Tunnel Gnawer',          'monster', 4, '/images/monsters/tunnel_gnawer.png',         'A hunched creature with cracked teeth and claws.'),
('Balanced Knife',         'weapon',  4, '/images/weapons/balanced_knife.png',         'A simple but well-balanced blade.'),
('Lesser Healing Potion',  'aid',     4, '/images/aids/lesser_healing_potion.png',     'Restores a modest amount of health.'),

-- LEVEL 5
('Grave Robber',           'monster', 5, '/images/monsters/grave_robber.png',          'A desperate criminal lurking in the dark.'),
('Bone Prowler',           'monster', 5, '/images/monsters/bone_prowler.png',          'A skeletal beast animated by foul magic.'),
('Guard''s Shortsword',    'weapon',  5, '/images/weapons/guards_shortsword.png',      'Standard city guard issue, reliable and sturdy.'),
('Reinforced Bandages',    'aid',     5, '/images/aids/reinforced_bandages.png',       'Tightly wrapped bandages that stop serious bleeding.'),

-- LEVEL 6
('Ghoul',                  'monster', 6, '/images/monsters/ghoul.png',                 'A corpse-eater hungry for living flesh.'),
('Dark Acolyte',           'monster', 6, '/images/monsters/dark_acolyte.png',          'A minor cultist channeling sickly energies.'),
('Iron Longsword',         'weapon',  6, '/images/weapons/iron_longsword.png',         'A dependable blade of solid iron.'),
('Standard Healing Potion','aid',     6, '/images/aids/standard_healing_potion.png',   'Restores a fair portion of your strength.'),

-- LEVEL 7
('Cave Troll Whelp',       'monster', 7, '/images/monsters/cave_troll_whelp.png',      'Not full-grown, but still very dangerous.'),
('Plague Cultist',         'monster', 7, '/images/monsters/plague_cultist.png',        'Spreads disease and doom in equal measure.'),
('Steel Broadsword',       'weapon',  7, '/images/weapons/steel_broadsword.png',       'Heavier, deadlier, and well-forged.'),
('Vigorous Elixir',        'aid',     7, '/images/aids/vigorous_elixir.png',           'Sharpens the senses and knits wounds.'),

-- LEVEL 8
('Ogre Brute',             'monster', 8, '/images/monsters/ogre_brute.png',            'A towering slab of muscle and rage.'),
('Spectral Warden',        'monster', 8, '/images/monsters/spectral_warden.png',       'A ghostly knight bound to guard forgotten halls.'),
('War Axe',                'weapon',  8, '/images/weapons/war_axe.png',                'A brutal axe designed for battlefield carnage.'),
('Greater Healing Potion', 'aid',     8, '/images/aids/greater_healing_potion.png',    'Restores a large amount of health.'),

-- LEVEL 9
('Revenant Knight',        'monster', 9, '/images/monsters/revenant_knight.png',       'An armored corpse fighting on grim reflex alone.'),
('Chaos Hound',            'monster', 9, '/images/monsters/chaos_hound.png',           'A warped beast that hunts by scent of fear.'),
('Knight''s Greatsword',   'weapon',  9, '/images/weapons/knights_greatsword.png',     'A massive sword wielded by elite knights.'),
('Blessed Sun Vial',       'aid',     9, '/images/aids/blessed_sun_vial.png',          'Sun-touched liquid that purges pain and fatigue.'),

-- LEVEL 10
('Ogre Warchief',          'monster', 10, '/images/monsters/ogre_warchief.png',        'Leads lesser ogres with sheer brutality.'),
('Necrotic Horror',        'monster', 10, '/images/monsters/necrotic_horror.png',      'A tangle of bone and shadow given hateful form.'),
('Runed Battleaxe',        'weapon',  10, '/images/weapons/runed_battleaxe.png',       'A heavy axe etched with faintly glowing runes.'),
('Major Healing Draught',  'aid',     10, '/images/aids/major_healing_draught.png',    'A potent mixture that closes grievous wounds.'),

-- LEVEL 11 (Jack)
('Vampire Stalker',        'monster', 11, '/images/monsters/vampire_stalker.png',      'A swift predator that drinks more than blood.'),
('Infernal Champion',      'monster', 11, '/images/monsters/infernal_champion.png',    'A warrior blessed by the fires of the pit.'),

-- LEVEL 12 (Queen)
('Lich Adept',             'monster', 12, '/images/monsters/lich_adept.png',           'Not yet a full lich, but already terrifying.'),
('Abyssal Behemoth',       'monster', 12, '/images/monsters/abyssal_behemoth.png',     'A hulking mass from beyond mortal realms.'),

-- LEVEL 13 (King)
('Dracolich Herald',       'monster', 13, '/images/monsters/dracolich_herald.png',     'A dragon-touched undead bearing ruin.'),
('Doomcaller Warlock',     'monster', 13, '/images/monsters/doomcaller_warlock.png',   'Channels catastrophic arcane forces.'),

-- LEVEL 14 (Ace)
('Ancient Dragon Wraith',  'monster', 14, '/images/monsters/ancient_dragon.png',       'The echo of a dragon''s rage after death.'),
('Demon Lord of Chains',   'monster', 14, '/images/monsters/demon_lord_of_chains.png', 'A towering fiend bound in its own shackles.');
