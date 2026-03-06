namespace API.Models;

public class LootEntry
{
    public string ItemName {get; set;}
    public double DropChance{get; set;}
}

public class LootTable
{
    public List<LootEntry> PossibleDrops { get; set; } = new();
    public string RollForDop()
    {
        var random = new Random();
        double roll = random.NextDouble();
        
        foreach(var entry in PossibleDrops)
        {
            if(roll <= entry.DropChance) return entry.ItemName;
        }
        return null;
    }
}