/**
 * Script to add actions from AI-Transformation and system improvements
 */

const { addTask } = require('./rtm-api');

async function addAITransformationActions() {
  const actions = [
    {
      name: 'Fixa så att man kan lägga in transkript',
      tags: ['jobb'],
      priority: '2',
      due: null
    },
    {
      name: 'Hitta sätt att leva i lätthet - mer dansformer',
      tags: ['fritid'],
      priority: '2',
      due: null
    },
    {
      name: 'Implementera OKR för kvartalet i Task Intelligence-systemet',
      tags: ['jobb'],
      priority: '2',
      due: null
    }
  ];

  console.log('📝 Adding AI-Transformation and system actions to RTM...\n');

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

addAITransformationActions().catch(console.error);


