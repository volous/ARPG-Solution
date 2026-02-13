namespace API.Models;

public class Equipment
{
    public int Id { get; set; }
    
    public string Weapon { get; set; } = "None";
    public string OffHand { get; set; } = "None";
    public string Helmet { get; set; } = "None";
    public string BodyArmor { get; set; } = "None";
    public string LegArmor { get; set; } = "None";
    public string Boots { get; set; } = "None";
    public string Gloves { get; set; } = "None";
    public string Ring1 { get; set; } = "None";
    public string Ring2 { get; set; } = "None";
    public string Amulet { get; set; } = "None";
    public string Belt { get; set; } = "None";
}