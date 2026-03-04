from engines.goal_planner import _optimize_goals, GoalRequest, GoalItem
import traceback

req = GoalRequest(
    goals=[GoalItem(name='Dream Home', amount=8000000, years=8, priority='High')], 
    monthlySavings=80000, 
    existingCorpus=1500000, 
    riskProfile='Moderate'
)

try:
    print("Testing _optimize_goals...")
    res = _optimize_goals(req)
    print("SUCCESS")
except Exception as e:
    print("ERROR:")
    traceback.print_exc()
