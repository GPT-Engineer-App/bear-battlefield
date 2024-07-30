from crewai import Agent, Task, Crew
from langchain.llms import OpenAI

# Initialize the LLM
llm = OpenAI(temperature=0.7)

# Define the agents
game_designer = Agent(
    role="Game Designer",
    goal="Design an engaging and balanced card battling game",
    backstory="Experienced game designer with expertise in card game mechanics",
    verbose=True,
    allow_delegation=True,
    llm=llm
)

artist = Agent(
    role="Artist",
    goal="Create visually appealing card designs and game assets",
    backstory="Talented digital artist specializing in fantasy and sci-fi themes",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

programmer = Agent(
    role="Programmer",
    goal="Implement game mechanics and create a functional prototype",
    backstory="Skilled game developer with experience in card game programming",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

# Define the tasks
design_core_mechanics = Task(
    description="Design the core mechanics of the card battling game, including card types, resource system, and win conditions",
    agent=game_designer
)

create_card_templates = Task(
    description="Design templates for different card types, ensuring they are visually distinct and appealing",
    agent=artist
)

implement_game_logic = Task(
    description="Implement the core game logic, including turn structure, card interactions, and win condition checks",
    agent=programmer
)

balance_gameplay = Task(
    description="Analyze and balance the gameplay, adjusting card stats and effects for fairness and fun",
    agent=game_designer
)

create_prototype = Task(
    description="Develop a playable prototype of the game, integrating the designed mechanics and artwork",
    agent=programmer
)

# Create the crew
card_game_crew = Crew(
    agents=[game_designer, artist, programmer],
    tasks=[design_core_mechanics, create_card_templates, implement_game_logic, balance_gameplay, create_prototype],
    verbose=2
)

# Function to run the crew and return the result
def run_game_development():
    return card_game_crew.kickoff()
