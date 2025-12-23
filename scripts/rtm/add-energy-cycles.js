/**
 * Script to add actions from unfinished energy cycles
 */

const { addTask } = require('./rtm-api');

async function addEnergyCycleActions() {
  const actions = [
    {
      name: 'Köp ny deo',
      tags: ['fritid', 'stan'],
      priority: '3',
      due: null
    },
    {
      name: 'Rensa bokhyllan',
      tags: ['fritid', 'hemma'],
      priority: '3',
      due: null
    },
    {
      name: 'Ladda mobila batteriet',
      tags: ['fritid', 'hemma'],
      priority: '3',
      due: null
    },
    {
      name: 'Boka mentormötet med Digjourney',
      tags: ['jobb', 'samtal'],
      priority: '2',
      due: null
    },
    {
      name: 'Boka möte med Samuel på ICA kring scoping',
      tags: ['jobb', 'samtal'],
      priority: '2',
      due: null
    },
    {
      name: 'Besvara mailen',
      tags: ['jobb'],
      priority: '2',
      due: null
    },
    {
      name: 'Hitta träningsprogram för att röra sig lågt med benen och stärka',
      tags: ['fritid'],
      priority: '2',
      due: null
    },
    {
      name: 'Hitta träningsform för mer flexibilitet, inte bara styrka - skifta mot funktionell träning',
      tags: ['fritid'],
      priority: '2',
      due: null
    },
    {
      name: 'Neela: Stäm av kring läget',
      tags: ['jobb', 'samtal'],
      priority: '2',
      due: null
    }
  ];

  console.log('📝 Adding energy cycle actions to RTM...\n');

  for (const action of actions) {
    try {
      // Build smart add string with tags and priority
      let smartAdd = action.name;
      
      // Add tags
      action.tags.forEach(tag => {
        smartAdd += ` #${tag}`;
      });
      
      // Add priority (!1, !2, !3)
      if (action.priority === '1') smartAdd += ' !1';
      else if (action.priority === '2') smartAdd += ' !2';
      else if (action.priority === '3') smartAdd += ' !3';
      
      // Add due date if specified
      if (action.due) {
        smartAdd += ` ^${action.due}`;
      }
      
      console.log(`Adding: ${smartAdd}`);
      const result = await addTask(smartAdd, null, true);
      console.log(`✅ Added: ${action.name}\n`);
    } catch (error) {
      console.error(`❌ Error adding "${action.name}":`, error.message);
    }
  }

  console.log('✨ Done! All energy cycle actions added to RTM.');
}

addEnergyCycleActions().catch(console.error);


