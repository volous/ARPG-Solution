using API.Models;

namespace API.Services;

public class ItemFactory : IITemFactory
{
    public Item CreateItem(string itemName)
    {
        return itemName.ToLower() switch
        {
            "iron sword" => new Item()
            {
                Name = "Iron Sword",
                Type = ItemType.Weapon,
                Damage = 8
            },
            "leather armor" => new Item
            {
                Name = "Leather Armor",
                Type = ItemType.Armor,
                Defense = 3,
                Resistance = "Physical"
            },
            "broken stick" => new Item
            {
                Name = "Broken Stick",
                Type = ItemType.Weapon,
                Damage = 0,
                DamageType = "Emotional"
            },
            "copper band" => new Item
            {
                Name = "Copper Band",
                Type = ItemType.Accessory,
                Defense = 1,
                Resistance = "None"
            },
            _ => new Item { Name = "Unknown Item" }
        };
    }

    public Item CreateRandomLoot(int powerLevel)
    {
        return CreateItem("Iron Sword");
    }
}