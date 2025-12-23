/**
 * Script to add actions identified during weekly review
 * Uses RTM smart add syntax for tags and priorities
 */

const { addTask } = require('./rtm-api');

async function addReviewActions() {
  const actions = [
    {
      name: 'Förtydliga kommunikationsplan för Tradedoubler',
      tags: ['jobb'],
      priority: '2',
      due: null
    },
    {
      name: 'Färdigställa Projektsystemet',
      tags: ['jobb'],
      priority: '2',
      due: null
    },
    {
      name: 'Färdigställa presentationen för SG',
      tags: ['jobb'],
      priority: '1',
      due: null // Should probably have a deadline, but user didn't specify
    },
    {
      name: 'Boka möte med Matthias för att synka inför SG',
      tags: ['jobb', 'samtal'],
      priority: '1',
      due: null
    },
    {
      name: 'Fråga Corin om han vill ha mer formell coaching i ett program',
      tags: ['jobb', 'samtal'],
      priority: '2',
      due: null
    },
    {
      name: 'Fråga Victoria om jag kan lägga tid på coaching av Corin',
      tags: ['jobb', 'samtal'],
      priority: '2',
      due: null
    }
  ];

  console.log('📝 Adding actions to RTM...\n');

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

  console.log('✨ Done! All actions added to RTM.');
}

addReviewActions().catch(console.error);


