namespace API.Models;

public enum ItemType
{
    Weapon,
    Armor,
    Accessory,
    Shield,
    Consumable
}
public class Item
{
    public string Name { get; set; }
    public ItemType Type { get; set; } = ItemType.Armor; 
    public int Damage { get; set; }
    public string DamageType { get; set; } = "Physical";
    public int Defense { get; set; }
    public string Resistance { get; set; } = "None";

}

public class Equipment
{
    public int Id { get; set; }
    
    public Item Weapon { get; set; } = new Item();
    public Item OffHand { get; set; } = new Item();
    public Item Helmet { get; set; } = new Item();
    public Item BodyArmor { get; set; } = new Item();
    public Item LegArmor { get; set; } = new Item();
    public Item Boots { get; set; } = new Item();
    public Item Gloves { get; set; } = new Item();
    public Item Ring1 { get; set; } = new Item();
    public Item Ring2 { get; set; } = new Item();
    public Item Amulet { get; set; } = new Item();
    public Item Belt { get; set; } = new Item();
}